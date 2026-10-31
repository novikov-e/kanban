from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import text

from app.api.dependencies import DbSession
from app.api.v1.router import api_router
from app.core.config import settings
from app.services.errors import NotFoundError

DESCRIPTION = """
API канбан-доски. Иерархия: **Board → Column → Task → Subtask**.

* Ответы в camelCase; вложенные списки отсортированы по `position`.
* Порядок элементов сервер берёт из БД: при создании элемент добавляется в конец,
  при перемещении и удалении позиции перенумеровываются без пропусков.
* Удаление мягкое и каскадное: вместе с элементом удаляются все дочерние.
* Авторизации пока нет: API работает от имени пользователя по умолчанию.
"""

TAGS = [
    {"name": "User", "description": "Текущий пользователь и его настройки"},
    {"name": "Board", "description": "Доски (в интерфейсе — проекты)"},
    {"name": "Column", "description": "Колонки доски"},
    {"name": "Task", "description": "Задачи в колонках"},
    {"name": "Subtask", "description": "Подзадачи задачи"},
    {"name": "Service", "description": "Служебные эндпоинты"},
]

app = FastAPI(title="Kanban API", version="1.0.0", description=DESCRIPTION, openapi_tags=TAGS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.exception_handler(NotFoundError)
async def handle_not_found(_: Request, error: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(error)})


class PingResponse(BaseModel):
    status: str
    db_version: str


@app.get("/ping", tags=["Service"], summary="Проверка доступности API и БД")
async def ping(db: DbSession) -> PingResponse:
    db_version = (await db.execute(text("SELECT version()"))).scalar_one()
    return PingResponse(status="ok", db_version=db_version)
