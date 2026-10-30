from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.user import LastBoardUpdate, ThemeUpdate, UserResponse
from app.services import user_service

router = APIRouter(prefix="/api/v1/user", tags=["User"])


@router.get("", response_model=UserResponse)
async def get_user(db: AsyncSession = Depends(get_db)):
    # Временно захардкожено, как в Java коде.
    # В будущем email должен извлекаться из JWT токена авторизации.
    email = "noved256@gmail.com"
    user = await user_service.get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("/theme")
async def update_dark_theme(theme_dto: ThemeUpdate, db: AsyncSession = Depends(get_db)):
    await user_service.update_theme(db, theme_dto.id, theme_dto.dark_theme)
    return {"status": "success"}


@router.post("/last_board")
async def update_last_board(dto: LastBoardUpdate, db: AsyncSession = Depends(get_db)):
    await user_service.update_last_board(db, dto.user_id, dto.board_id)
    return {"status": "success"}
