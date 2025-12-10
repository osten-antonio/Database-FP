from pydantic import BaseModel
from datetime import datetime, timezone

class Orders():
    product_name: str
    order_price: float
    amount: int

class OrderBase(BaseModel):
    id: int
    warehouse_name: str
    delivery_date: datetime
    address: str
    order_date: datetime
    status: int
    customer_name: str
    orders: list[Orders]

class OrderResponse(BaseModel):
    orders: list[OrderBase]

class OrderCreate(BaseModel):
    warehouse_name: str
    delivery_date: datetime
    address_id: int
    order_date: datetime
    status: int
    customer_name: str
    orders: list[OrderBase]


