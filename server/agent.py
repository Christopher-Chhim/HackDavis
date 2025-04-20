from dotenv import load_dotenv

load_dotenv()

from cerebras.cloud.sdk import AsyncCerebras
from typing import List, Dict, Any
import os
from custom_types import (
    ResponseRequiredRequest,
    ResponseResponse,
    Utterance,
    ToolCallInvocationResponse,
    ToolCallResultResponse,
    AgentInterruptResponse,
)
from prompts import (
    system_prompt,
    persistent_user_prompt,
    user_prompt,
)
import json
import os
from supabase import create_async_client, AsyncClient


class LlmClient:
    async def __init__(self):
        """
        Initialize LLM client

        """
        self.client = AsyncCerebras(
            api_key=os.environ["CEREBRAS_API_KEY"],
        )
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        self.supabase: AsyncClient = create_async_client(url, key)

    def draft_begin_message(self):
        response = ResponseResponse(
            response_id=0,
            content="Hello, this is SentinelAI, your emergency assistant. What is the problem?",
            content_complete=True,
            end_call=False,
        )

        return response

    def convert_transcript_to_openai_messages(self, transcript: List[Utterance]):
        messages = []
        for utterance in transcript:
            if utterance.role == "agent":
                messages.append({"role": "assistant", "content": utterance.content})
            else:
                messages.append({"role": "user", "content": utterance.content})
        return messages

    def prepare_prompt(self, request: ResponseRequiredRequest):
        prompt = [
            {
                "role": "system",
                "content": system_prompt,
            },
        ]
        transcript_messages = self.convert_transcript_to_openai_messages(
            request.transcript
        )
        for message in transcript_messages:
            prompt.append(message)

        prompt.append(
            {
                "role": "user",
                "content": persistent_user_prompt,
            }
        )

        if request.interaction_type == "reminder_required":
            prompt.append(
                {
                    "role": "user",
                    "content": "(Now the user has not responded in a while, you would say:)",
                }
            )
        return prompt

    def prepare_functions(self) -> List[Dict[str, Any]]:
        """
        Define the available function calls for the assistant.
        """
        return [
            {
                "type": "function",
                "function": {
                    "name": "open_door",
                    "strict": True,
                    "description": "Opens a door in the mall by its ID",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "door_id": {
                                "type": "integer",
                                "description": "The ID of the door to open",
                            }
                        },
                        "required": ["door_id"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "close_door",
                    "strict": True,
                    "description": "Closes a door in the mall by its ID",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "door_id": {
                                "type": "integer",
                                "description": "The ID of the door to close",
                            }
                        },
                        "required": ["door_id"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "mark_zone",
                    "strict": True,
                    "description": "Marks a zone with a specific status",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "zone_id": {
                                "type": "integer",
                                "description": "The ID of the zone to mark",
                            },
                            "status": {
                                "type": "string",
                                "enum": ["ok", "danger"],
                                "description": "The status to mark the zone with",
                            },
                        },
                        "required": ["zone_id", "status"],
                    },
                },
            },
        ]

    async def draft_response(self, request: ResponseRequiredRequest):
        # Initialize conversation with the user prompt.
        conversation = self.prepare_prompt(request)
        response_id = request.response_id

        stream = await self.client.chat.completions.create(
            model="llama-3.3-70b",
            messages=conversation,
            tools=self.prepare_functions(),
            parallel_tool_calls=True,
            stream=True,
        )

        async for chunk in stream:
            if chunk.choices[0].delta.tool_calls:
                # Handle function call
                function_call = chunk.choices[0].delta.tool_calls
                if function_call.name == "open_door":
                    print(f"Opening door {function_call.arguments['door_id']}")
                elif function_call.name == "close_door":
                    print(f"Closing door {function_call.arguments['door_id']}")
                elif function_call.name == "mark_zone":
                    print(
                        f"Marking zone {function_call.arguments['zone_id']} with status {function_call.arguments['status']}"
                    )

                # Execute the function and handle the result
                # You'll need to implement this part based on your specific function
            elif chunk.choices[0].delta.content:
                # Handle regular content
                yield ResponseResponse(
                    response_id=response_id,
                    content=chunk.choices[0].delta.content,
                    content_complete=False,
                    end_call=False,
                )
        # After all rounds, yield a final complete response.
        yield ResponseResponse(
            response_id=response_id,
            content="",
            content_complete=True,
            end_call=False,
        )
