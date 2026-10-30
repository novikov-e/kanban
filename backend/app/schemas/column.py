from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.task import TaskResponse


class ColumnResponse(BaseModel):
    id: UUID = Field(validation_alias="column_id")
    name: str = Field(validation_alias="column_name")
    position: int = Field(validation_alias="column_position")
    task_lists: list[TaskResponse] = Field(default=[], validation_alias="tasks", serialization_alias="taskLists")
    model_config = ConfigDict(from_attributes=True)
