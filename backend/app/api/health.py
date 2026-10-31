from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import SessionFactory

router = APIRouter()


@router.get("/health", include_in_schema=False)
async def health() -> JSONResponse:
    """Готовность для healthcheck в docker-compose: процесс отвечает и БД доступна."""
    try:
        async with SessionFactory() as session:
            await session.execute(text("SELECT 1"))
    except (SQLAlchemyError, OSError):
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content={"status": "unavailable"})
    return JSONResponse(content={"status": "ok"})
