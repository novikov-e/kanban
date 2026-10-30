from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

# Общие DTO запросов для всех уровней иерархии (board -> column -> task -> subtask).
# Позиции и родители, которые фронтенд присылает "до" операции, сервер не использует:
# актуальный порядок всегда берётся из БД.


class CreateObjectDto(BaseModel):
    parent_object_id: UUID = Field(alias="parentObjectId")
    position: int
    model_config = ConfigDict(populate_by_name=True)


class CreateObjectWithNameDto(BaseModel):
    parent_object_id: UUID = Field(alias="parentObjectId")
    name: str
    position: int
    model_config = ConfigDict(populate_by_name=True)


class RenameDto(BaseModel):
    object_id: UUID = Field(alias="objectId")
    name: str
    model_config = ConfigDict(populate_by_name=True)


class MoveDto(BaseModel):
    moved_object_id: UUID = Field(alias="movedObjectId")
    current_parent_object: UUID = Field(alias="currentParentObject")
    current_position: int = Field(alias="currentPosition", ge=0)
    model_config = ConfigDict(populate_by_name=True)


class DeleteObjectDto(BaseModel):
    object_id: UUID = Field(alias="objectId")
    model_config = ConfigDict(populate_by_name=True)
