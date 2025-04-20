import os
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import TimeoutError as ConnectionTimeoutError
from retell import Retell
from custom_types import ConfigResponse, ResponseRequiredRequest, ResponseResponse
from agent import LlmClient

agent_id = "agent-d5bbe3d9-6f4a-496c-a455-9b6ef4b82b5d"

load_dotenv(override=True)
app = FastAPI()
origins = ["http://localhost:3000", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

retell = Retell(api_key=os.environ["RETELL_API_KEY"])


# WebSocket server for exchanging messages with the Retell server.
@app.websocket("/llm-websocket/{call_id}")
async def websocket_handler(websocket: WebSocket, call_id: str):
    try:
        await websocket.accept()
        client = LlmClient()

        # Send configuration to the Retell server
        config = ConfigResponse(
            response_type="config",
            config={
                "auto_reconnect": True,
                "call_details": True,
            },
            response_id=1,
        )
        await websocket.send_json(config.__dict__)
        response_id = 0

        async def handle_message(request_json):
            nonlocal response_id
            if request_json["interaction_type"] == "call_details":
                event = client.draft_begin_message()
                await websocket.send_json(event.__dict__)
                return
            if request_json["interaction_type"] == "ping_pong":
                pong_response = {
                    "response_type": "ping_pong",
                    "timestamp": request_json["timestamp"],
                }
                print("Sending ping pong response:", pong_response)
                await websocket.send_json(pong_response)
                return
            if request_json.get("interaction_type") == "update_only":
                print("Update only interaction received, ignoring.")
                return
            if request_json.get("interaction_type") == "update_only":
                return
            if (
                request_json["interaction_type"] == "response_required"
                or request_json["interaction_type"] == "reminder_required"
            ):
                response_id = request_json["response_id"]
                request = ResponseRequiredRequest(
                    interaction_type=request_json["interaction_type"],
                    response_id=response_id,
                    transcript=request_json["transcript"],
                )
                print(
                    f"""Received interaction_type={request_json['interaction_type']}, response_id={response_id}, last_transcript={request_json['transcript'][-1]['content']}"""
                )

                async for event in client.draft_response(request):
                    try:
                        await websocket.send_json(event.__dict__)
                    except Exception as e:
                        print(f"Error in LLM WebSocket: {e} for {call_id}")
                    if request.response_id < response_id:
                        print("Breaking")
                        break  # new response needed, abandon this one

        async for data in websocket.iter_json():
            asyncio.create_task(handle_message(data))

    except WebSocketDisconnect:
        print(f"LLM WebSocket disconnected for {call_id}")
    except ConnectionTimeoutError as e:
        print(f"Connection timeout error for {call_id}: {e}")
    except Exception as e:
        print(f"Error in LLM WebSocket: {e} for call_id: {call_id}")
        await websocket.close(1011, "Server error")
    finally:
        print(f"LLM WebSocket connection closed for {call_id}")
