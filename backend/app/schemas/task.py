from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ApiRequest
from app.schemas.subtask import SubtaskResponse

TASK_COLOR_DESCRIPTION = "Номер цвета из палитры интерфейса: 1 — нейтральный, 2–8 — цветные"


class ChangeColorRequest(ApiRequest):
    task_id: UUID = Field(description="Идентификатор задачи")
    color: int = Field(ge=1, le=8, description=TASK_COLOR_DESCRIPTION)


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="task_id")
    name: str = Field(validation_alias="task_name")
    color: int = Field(description=TASK_COLOR_DESCRIPTION)
    position: int = Field(validation_alias="task_position", description="Позиция в колонке, с нуля")
    subtasks: list[SubtaskResponse] = Field(default=[], description="Подзадачи в порядке позиций")
