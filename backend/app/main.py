from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from .db import connect
from .api import user, warehouse, product, customer, supplier, order, dashboard, category, restock

app = FastAPI(title="Database-FP API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user.router)
app.include_router(warehouse.router)
app.include_router(product.router)
app.include_router(customer.router)
app.include_router(supplier.router)
app.include_router(order.router)
app.include_router(dashboard.router)
app.include_router(category.router)
app.include_router(restock.router)

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
    uvicorn.run(app, host="0.0.0.0", port=9000)