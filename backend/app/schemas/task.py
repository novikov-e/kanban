from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.subtask import SubtaskResponse


class ChangeColorDto(BaseModel):
    # В Java это называлось taskListId
    task_id: UUID = Field(alias="taskListId")
    color: int = Field(ge=1, le=8)
    model_config = ConfigDict(populate_by_name=True)


# На фронтенде задача называется TaskList, а её подзадачи — tasks
class TaskResponse(BaseModel):
    id: UUID = Field(validation_alias="task_id")
    name: str = Field(validation_alias="task_name")
    color: int
    position: int = Field(validation_alias="task_position")
    tasks: list[SubtaskResponse] = Field(default=[], validation_alias="subtasks")
    model_config = ConfigDict(from_attributes=True)
