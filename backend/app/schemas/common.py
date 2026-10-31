from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

POSITION_DESCRIPTION = "Ключ сортировки в списке родителя: важен только порядок, значения не идут подряд"
INDEX_DESCRIPTION = (
    "Новое место в списке родителя, с нуля. Значение больше длины списка — вставка в конец. "
    "Если указан только новый родитель, элемент встаёт в конец его списка"
)


class ApiRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class CreateNamedRequest(ApiRequest):
    """Создание элемента в конце списка родителя."""

    name: str = Field(description="Название", examples=["Новая задача"])


class ErrorResponse(BaseModel):
    detail: str = Field(examples=["Board not found"])
