from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import INDEX_DESCRIPTION, POSITION_DESCRIPTION, ApiRequest
from app.schemas.subtask import SubtaskResponse

TASK_COLOR_DESCRIPTION = "Номер цвета из палитры интерфейса: 1 — нейтральный, 2–8 — цветные"


class TaskUpdateRequest(ApiRequest):
    """Частичное изменение задачи; `columnId` и `index` перемещают её."""

    name: str | None = Field(default=None, description="Новое название")
    color: int | None = Field(default=None, ge=1, le=8, description=TASK_COLOR_DESCRIPTION)
    column_id: UUID | None = Field(default=None, description="Новая колонка пользователя")
    index: int | None = Field(default=None, ge=0, description=INDEX_DESCRIPTION)


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="task_id")
    name: str = Field(validation_alias="task_name")
    color: int = Field(description=TASK_COLOR_DESCRIPTION)
    position: float = Field(validation_alias="task_position", description=POSITION_DESCRIPTION)
    subtasks: list[SubtaskResponse] = Field(default=[], description="Подзадачи в порядке позиций")
