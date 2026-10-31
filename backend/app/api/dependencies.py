from typing import Annotated, Any

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.common import ErrorResponse

DbSession = Annotated[AsyncSession, Depends(get_db)]


def not_found(*entities: str) -> dict[int | str, dict[str, Any]]:
    return {404: {"model": ErrorResponse, "description": f"Не найдено: {', '.join(entities)}"}}
