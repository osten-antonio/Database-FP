from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

'''
used to store stuffs like the paths, and env vars
'''
config_dir = Path(__file__).resolve().parent

class Settings(BaseSettings):
    db_password:str
    db_host:str
    db:str
    db_user:str

    class Config:
        env_file = str(config_dir.parent.parent / ".env")  
        env_file_encoding = 'utf-8'

settings = Settings()
