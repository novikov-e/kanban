from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ChangeStateDto(BaseModel):
    subtask_id: UUID = Field(alias="subtaskId")
    state: bool
    model_config = ConfigDict(populate_by_name=True)


class SubtaskResponse(BaseModel):
    id: UUID = Field(validation_alias="subtask_id")
    name: str = Field(validation_alias="subtask_name")
    state: bool = Field(validation_alias="subtask_state")
    position: int = Field(validation_alias="subtask_position")
    model_config = ConfigDict(from_attributes=True)
