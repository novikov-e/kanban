from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    POSTGRES_USER: str = "kanban_user"
    POSTGRES_PASSWORD: str = "kanban_password"
    POSTGRES_HOST: str = "postgresql"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "kanban_db"
    DB_ECHO: bool = False

    CORS_ORIGINS: list[str] = ["http://localhost:4200", "http://127.0.0.1:4200"]

    # Авторизации пока нет: API работает от имени этого пользователя
    DEFAULT_USER_EMAIL: str = "noved256@gmail.com"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


settings = Settings()
