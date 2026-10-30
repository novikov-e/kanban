from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1 import board, column, subtask, task, user
from app.core.config import settings
from app.db.database import get_db

app = FastAPI(title="Kanban API")

# В dev-режиме Angular ходит через proxy.conf.json, CORS нужен только при прямых запросах
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(board.router)
app.include_router(column.router)
app.include_router(task.router)
app.include_router(subtask.router)

@app.get("/ping")
async def ping_db(session: AsyncSession = Depends(get_db)):
    # Тестовый запрос к БД для проверки соединения
    result = await session.execute(text("SELECT version();"))
    db_version = result.scalar()
    return {"status": "ok", "db_version": db_version}
