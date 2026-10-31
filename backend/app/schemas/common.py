from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class ApiRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class CreateChildRequest(ApiRequest):
    """Создание элемента в конце списка родителя."""

    parent_object_id: UUID = Field(description="Идентификатор родителя: доски, колонки или задачи")
    name: str = Field(description="Название элемента", examples=["Новая задача"])


class RenameRequest(ApiRequest):
    object_id: UUID = Field(description="Идентификатор переименовываемого элемента")
    name: str = Field(description="Новое название", examples=["В работе"])


class MoveRequest(ApiRequest):
    """Перемещение элемента. Текущие родитель и позиция берутся из БД, а не из запроса."""

    moved_object_id: UUID = Field(description="Идентификатор перемещаемого элемента")
    current_parent_object: UUID = Field(description="Идентификатор нового родителя")
    current_position: int = Field(
        ge=0, description="Новая позиция в списке родителя, с нуля. Значение больше длины списка — вставка в конец"
    )


class DeleteRequest(ApiRequest):
    """Мягкое удаление элемента вместе со всеми дочерними; оставшиеся элементы перенумеровываются."""

    object_id: UUID = Field(description="Идентификатор удаляемого элемента")


class StatusResponse(BaseModel):
    status: Literal["success"] = "success"


class ErrorResponse(BaseModel):
    detail: str = Field(examples=["Board not found"])
