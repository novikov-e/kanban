from fastapi import APIRouter

from app.api.v1 import auth, board, column, subtask, task, user

api_router = APIRouter(prefix="/api/v1")

for module in (auth, user, board, column, task, subtask):
    api_router.include_router(module.router)
