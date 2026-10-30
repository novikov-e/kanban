from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

engine = create_async_engine(settings.database_url, echo=settings.DB_ECHO)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    autocommit=False, 
    autoflush=False, 
    expire_on_commit=False
)

# Зависимость (Dependency) для получения сессии в эндпоинтах
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

class Base(DeclarativeBase):
    pass
