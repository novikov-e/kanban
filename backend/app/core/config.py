from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    POSTGRES_USER: str = "kanban_user"
    POSTGRES_PASSWORD: str = "kanban_password"
    POSTGRES_HOST: str = "postgresql" # Внутри Docker будет "postgresql"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "kanban_db"

    # Логирование SQL-запросов (удобно для отладки)
    DB_ECHO: bool = False
    # В .env задаётся JSON-списком: CORS_ORIGINS=["http://localhost:4200"]
    CORS_ORIGINS: list[str] = ["http://localhost:4200", "http://127.0.0.1:4200"]

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Чтение из файла .env, если он есть
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
