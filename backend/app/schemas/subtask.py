from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import INDEX_DESCRIPTION, POSITION_DESCRIPTION, ApiRequest


class SubtaskUpdateRequest(ApiRequest):
    """Частичное изменение подзадачи; `taskId` и `index` перемещают её."""

    name: str | None = Field(default=None, description="Новое название")
    state: bool | None = Field(default=None, description="Выполнена ли подзадача")
    task_id: UUID | None = Field(default=None, description="Новая задача пользователя")
    index: int | None = Field(default=None, ge=0, description=INDEX_DESCRIPTION)


class SubtaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(validation_alias="subtask_id")
    name: str = Field(validation_alias="subtask_name")
    state: bool = Field(validation_alias="subtask_state", description="Выполнена ли подзадача")
    position: float = Field(validation_alias="subtask_position", description=POSITION_DESCRIPTION)
