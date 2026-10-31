from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.errors import AuthError, ConflictError, NotFoundError

DESCRIPTION = """
API канбан-доски. Иерархия: **Board → Column → Task → Subtask**.

* Ответы в camelCase; вложенные списки отсортированы по `position`.
* Порядок элементов сервер берёт из БД: при создании элемент добавляется в конец,
  при перемещении и удалении позиции перенумеровываются без пропусков.
* Удаление мягкое и каскадное: вместе с элементом удаляются все дочерние.
* Все эндпоинты, кроме `/auth`, требуют заголовок `Authorization: Bearer <access-токен>` и работают
  только с данными текущего пользователя: чужие объекты отвечают 404.
"""

TAGS = [
    {"name": "Auth", "description": "Регистрация, вход и обновление токенов"},
    {"name": "User", "description": "Текущий пользователь и его настройки"},
    {"name": "Board", "description": "Доски (в интерфейсе — проекты)"},
    {"name": "Column", "description": "Колонки доски"},
    {"name": "Task", "description": "Задачи в колонках"},
    {"name": "Subtask", "description": "Подзадачи задачи"},
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


@app.exception_handler(AuthError)
async def handle_auth_error(_: Request, error: AuthError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(error)},
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.exception_handler(ConflictError)
async def handle_conflict(_: Request, error: ConflictError) -> JSONResponse:
    return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"detail": str(error)})
