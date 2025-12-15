from fastapi import FastAPI

import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from .db import connect

app = FastAPI()


@app.get("/test-db")
def test_db_connection():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return {"status": "ok", "result": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/show-tables")
def show_tables():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]

        cursor.close()
        conn.close()

        return {"tables": tables}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=9000)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=6767, reload=True)