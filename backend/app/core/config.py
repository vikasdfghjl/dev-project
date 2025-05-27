# App configuration using pydantic-settings
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    class Config:
        env_file = ".env"

settings = Settings()
