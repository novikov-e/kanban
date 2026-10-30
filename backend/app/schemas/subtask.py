from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ChangeStateDto(BaseModel):
    # Фронтенд присылает taskId, но в новой БД это subtask_id
    subtask_id: UUID = Field(alias="taskId")
    state: bool
    model_config = ConfigDict(populate_by_name=True)


# На фронтенде подзадача называется Task
class SubtaskResponse(BaseModel):
    id: UUID = Field(validation_alias="subtask_id")
    name: str = Field(validation_alias="subtask_name")
    state: bool = Field(validation_alias="subtask_state")
    position: int = Field(validation_alias="subtask_position")
    model_config = ConfigDict(from_attributes=True)
