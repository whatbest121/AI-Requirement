import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    mongodb_url: str = "mongodb://mongo:27017"
    database_name: str = "AiRequestDB"
    
    host: str = "0.0.0.0"
    port: int = 8000
    environment: str = "development"
    openai_api_key: str 
    openai_base_url:str
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()