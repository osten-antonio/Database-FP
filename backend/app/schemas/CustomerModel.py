from pydantic import BaseModel

class Address():
    address:str
    phone_num:str

class CustomerBase(BaseModel):
    id: int
    name: str
    addresses: list[Address]

class CustomerResponse(BaseModel):
    customers: list[CustomerBase]



class CustomerCreate(BaseModel):
    name: str
    addresses: list[Address]
