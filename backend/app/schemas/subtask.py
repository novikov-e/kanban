from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import POSITION_DESCRIPTION, ApiRequest


class ChangeStateRequest(ApiRequest):
    subtask_id: UUID = Field(description="Идентификатор подзадачи")
    state: bool = Field(description="Выполнена ли подзадача")


class SubtaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="subtask_id")
    name: str = Field(validation_alias="subtask_name")
    state: bool = Field(validation_alias="subtask_state", description="Выполнена ли подзадача")
    position: float = Field(validation_alias="subtask_position", description=POSITION_DESCRIPTION)
