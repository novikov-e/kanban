from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import INDEX_DESCRIPTION, POSITION_DESCRIPTION, ApiRequest
from app.schemas.task import TaskResponse


class ColumnUpdateRequest(ApiRequest):
    """Частичное изменение колонки; `boardId` и `index` перемещают её."""

    name: str | None = Field(default=None, description="Новое название")
    board_id: UUID | None = Field(default=None, description="Новая доска пользователя")
    index: int | None = Field(default=None, ge=0, description=INDEX_DESCRIPTION)


class ColumnResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="column_id")
    name: str = Field(validation_alias="column_name")
    position: float = Field(validation_alias="column_position", description=POSITION_DESCRIPTION)
    tasks: list[TaskResponse] = Field(default=[], description="Задачи в порядке позиций")
