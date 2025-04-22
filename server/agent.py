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
from retell import Retell

retell = Retell(api_key=os.environ["RETELL_API_KEY"])
zone_door_mapping = {
    0: [0],
    1: [1],
    2: [2],
    3: [3],
    4: [8],
    5: [7, 6, 9],
    6: [4, 5, 6],
    7: [5, 8, 7],
    8: [0, 4, 1, 2, 3, 9],
}


class LlmClient:
    def __init__(self):
        """
        Initialize LLM client

        """
        self.client = AsyncCerebras(
            api_key=os.environ["CEREBRAS_API_KEY"],
        )
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        self.supabase: AsyncClient = None

    async def setup_supabase(self):
        """
        Initialize Supabase client asynchronously
        """
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        self.supabase = await create_async_client(url, key)

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
                            },
                            "output": {
                                "type": "string",
                                "description": "The message back to the user after the door is opened",
                            },
                        },
                        "required": ["door_id", "output"],
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
                            },
                            "output": {
                                "type": "string",
                                "description": "The message back to the user after the door is closed",
                            },
                        },
                        "required": ["door_id", "output"],
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
                            "output": {
                                "type": "string",
                                "description": "The message back to the user after the zone is marked",
                            },
                            "status": {
                                "type": "string",
                                "enum": ["ok", "danger"],
                                "description": "The status to mark the zone with",
                            },
                        },
                        "required": ["zone_id", "output", "status"],
                    },
                },
            },
            # {
            #     "type": "function",
            #     "function": {
            #         "name": "notify_emergency_responders",
            #         "strict": True,
            #         "description": "Notifies emergency responders (911) of a situation",
            #         "parameters": {
            #             "type": "object",
            #             "properties": {
            #                 "situation": {
            #                     "type": "string",
            #                     "description": "The situation that is happening. Call this function when you have enough information to call 911.",
            #                 },
            #                 "output": {
            #                     "type": "string",
            #                     "description": "The message back to the user after the emergency responders are notified",
            #                 },
            #             },
            #             "required": ["situation", "output"],
            #         },
            #     },
            # },
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
                function_calls = chunk.choices[0].delta.tool_calls
                print(f"Function calls: {function_calls}")
                for function_call in function_calls:
                    arguments = json.loads(function_call.function.arguments)

                    if function_call.function.name == "open_door":
                        print(f"Opening door {arguments['door_id']}")
                        await self.supabase.table("doors").update({"open": True}).eq(
                            "id", arguments["door_id"]
                        ).execute()
                    elif function_call.function.name == "close_door":
                        print(f"Closing door {arguments['door_id']}")
                        await self.supabase.table("doors").update({"open": False}).eq(
                            "id", arguments["door_id"]
                        ).execute()
                    elif function_call.function.name == "mark_zone":
                        print(
                            f"Marking zone {arguments['zone_id']} with status {arguments['status']}"
                        )
                        await self.supabase.table("zones").update(
                            {"status": arguments["status"]}
                        ).eq("id", arguments["zone_id"]).execute()

                        if arguments["status"] == "danger":
                            doors_to_close = zone_door_mapping[arguments["zone_id"]]
                            # Update all doors in a single call with an "in" filter
                            await self.supabase.table("doors").update(
                                {"open": False}
                            ).in_("id", doors_to_close).execute()
                        else:
                            doors_to_open = zone_door_mapping[arguments["zone_id"]]
                            print(f"Opening doors {doors_to_open}")
                            await self.supabase.table("doors").update(
                                {"open": True}
                            ).in_("id", doors_to_open).execute()

                    elif function_call.function.name == "notify_emergency_responders":
                        print(
                            f"Notifying emergency responders of {arguments['situation']}"
                        )
                        # retell.call.create_phone_call(
                        #     from_number="+13192504307",
                        #     to_number="+14152445168",
                        #     retell_llm_dynamic_variables={
                        #         "situation": arguments["situation"]
                        #     },
                        # )

                    yield ResponseResponse(
                        response_id=response_id,
                        content=arguments["output"],
                        content_complete=True,
                        end_call=False,
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
