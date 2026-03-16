from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "Inventory Management API"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg2://inventory_user:inventory_password@localhost:5432/inventory"
    backend_cors_origins: list[str] = ["http://localhost:5173"]
    secret_key: str = "change-me-in-.env"  # used for session cookies
    session_cookie_name: str = "inventory_session"

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


settings = Settings()
