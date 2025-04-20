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
    user_prompt,
)
import json


class LlmClient:
    def __init__(self):
        """
        Initialize LLM client

        """
        self.client = AsyncCerebras(
            api_key=os.environ["CEREBRAS_API_KEY"],
        )

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
        return []

    async def draft_response(self, request: ResponseRequiredRequest):
        # Initialize conversation with the user prompt.
        conversation = self.prepare_prompt(request)
        response_id = request.response_id
        print("Functions:", self.prepare_functions())


        stream = await self.client.chat.completions.create(
            model="llama-4-scout-17b-16e-instruct",
            messages=conversation,
            tools=[],
            parallel_tool_calls=False,
            stream=True,
        )

        async for chunk in stream:
            if chunk.choices[0].delta.tool_calls:
                # Handle function call
                function_call = chunk.choices[0].delta.tool_calls
                print(f"Function called: {function_call.name}")
                print(f"Arguments: {function_call.arguments}")
                
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