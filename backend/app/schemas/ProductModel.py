from pydantic import BaseModel

class ProductsBase(BaseModel):
    id: int
    account_id: int
    name: str
    total_sales: int
    supplier: str # Name
    price: float
    category_id: int

class ProductsResponse(ProductsBase):
    products: list[ProductsBase]

class ProductsCreate(BaseModel):
    name: str
    price: float
    category_id: int