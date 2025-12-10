import mysql.connector
from ..core import settings

def connect():
    conn = mysql.connector.connect(
            host='localhost',
            port=3307,
            user=settings.db_user,
            password=settings.db_password,
            database=settings.db
        )
    return conn