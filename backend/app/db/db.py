import mysql.connector
from ..core import settings

def connect():
    conn = mysql.connector.connect(
            host=settings.db_host,
            user=settings.db_user,
            password=settings.db_password,
            database=settings.db
        )
    return conn