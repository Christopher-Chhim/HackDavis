from typing import Any, List, Optional, Literal, Union
from pydantic import BaseModel
from typing import Literal, Dict, Optional


# Retell -> Your Server Events
class Utterance(BaseModel):
    role: Literal["agent", "user", "system"]
    content: str


class PingPongRequest(BaseModel):
    interaction_type: Literal["ping_pong"]
    timestamp: int


class CallDetailsRequest(BaseModel):
    interaction_type: Literal["call_details"]
    call: dict


class UpdateOnlyRequest(BaseModel):
    interaction_type: Literal["update_only"]
    transcript: List[Utterance]


class ResponseRequiredRequest(BaseModel):
    interaction_type: Literal["reminder_required", "response_required"]
    response_id: int
    transcript: List[Utterance]


CustomLlmRequest = Union[
    ResponseRequiredRequest | UpdateOnlyRequest | CallDetailsRequest | PingPongRequest
]


# Your Server -> Retell Events
class ConfigResponse(BaseModel):
    response_type: Literal["config"] = "config"
    config: Dict[str, bool] = {
        "auto_reconnect": bool,
        "call_details": bool,
    }


class PingPongResponse(BaseModel):
    response_type: Literal["ping_pong"] = "ping_pong"
    timestamp: int


class ResponseResponse(BaseModel):
    response_type: Literal["response"] = "response"
    response_id: int
    content: str
    content_complete: bool
    end_call: Optional[bool] = False
    transfer_number: Optional[str] = None


class AgentInterruptResponse(BaseModel):
    response_type: Literal["agent_interrupt"] = "agent_interrupt"
    interrupt_id: int
    content: str
    content_complete: bool
    no_interruption_allowed: Optional[bool] = None
    end_call: Optional[bool] = False
    transfer_number: Optional[str] = None
    digit_to_press: Optional[str] = None


class ToolCallInvocationResponse(BaseModel):
    response_type: Literal["tool_call_invocation"] = "tool_call_invocation"
    tool_call_id: str
    name: str
    arguments: str


class ToolCallResultResponse(BaseModel):
    response_type: Literal["tool_call_result"] = "tool_call_result"
    tool_call_id: str
    content: str


CustomLlmResponse = Union[ConfigResponse | PingPongResponse | ResponseResponse]