from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.column import ColumnResponse


# Элемент списка проектов пользователя (без вложенных колонок)
class BoardShortResponse(BaseModel):
    id: UUID = Field(validation_alias="board_id")
    name: str = Field(validation_alias="board_name")
    position: int = Field(validation_alias="board_position")
    model_config = ConfigDict(from_attributes=True)


class BoardResponse(BoardShortResponse):
    columns: list[ColumnResponse] = []
