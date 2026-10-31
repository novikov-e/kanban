from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import POSITION_DESCRIPTION
from app.schemas.task import TaskResponse


class ColumnResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="column_id")
    name: str = Field(validation_alias="column_name")
    position: float = Field(validation_alias="column_position", description=POSITION_DESCRIPTION)
    tasks: list[TaskResponse] = Field(default=[], description="Задачи в порядке позиций")
