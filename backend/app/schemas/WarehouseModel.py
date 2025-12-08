from pydantic import BaseModel
from .CustomerModel import CustomerBase

class WarehouseBase(BaseModel):
    name: str
    address: str

class WarehouseSpecific(WarehouseBase):
    manager_name: str
    manager_email: str
    manager_phone: str
    manager_address: str
    total_revenue: float
    total_sales: int
    item_stock: int
    orders_in_progress: int
    orders_overdue: int
    orders_completed: int
    