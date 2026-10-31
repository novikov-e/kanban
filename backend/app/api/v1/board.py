from uuid import UUID

from fastapi import APIRouter, Request, status

from app.api.dependencies import UNAUTHORIZED, CurrentUserId, DbSession, not_found
from app.api.etag import NOT_MODIFIED, json_with_etag
from app.schemas.board import BoardResponse, BoardUpdateRequest
from app.services import board_service

router = APIRouter(prefix="/boards", tags=["Board"], responses=UNAUTHORIZED)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=BoardResponse, summary="Создать доску")
async def create_board(user_id: CurrentUserId, db: DbSession):
    """Создаёт доску с названием по умолчанию в конце списка досок пользователя."""
    return await board_service.create_board(db, user_id)


@router.get(
    "/{board_id}",
    response_model=BoardResponse,
    summary="Доска целиком",
    responses={**not_found("доска"), **NOT_MODIFIED},
)
async def get_board(board_id: UUID, request: Request, user_id: CurrentUserId, db: DbSession):
    """Доска со всеми колонками, задачами и подзадачами.

    Ответ содержит `ETag`; с заголовком `If-None-Match` неизменившаяся доска отвечает 304 без тела.
    """
    board = await board_service.get_board(db, user_id, board_id)
    return json_with_etag(request, BoardResponse.model_validate(board))


@router.patch(
    "/{board_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Изменить доску", responses=not_found("доска")
)
async def update_board(board_id: UUID, request: BoardUpdateRequest, user_id: CurrentUserId, db: DbSession) -> None:
    """Переименование и изменение порядка доски в списке пользователя."""
    await board_service.update_board(db, user_id, board_id, request.name, request.index)


@router.delete(
    "/{board_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Удалить доску", responses=not_found("доска")
)
async def delete_board(board_id: UUID, user_id: CurrentUserId, db: DbSession) -> None:
    """Удаляет доску вместе с колонками, задачами и подзадачами."""
    await board_service.delete_board(db, user_id, board_id)
