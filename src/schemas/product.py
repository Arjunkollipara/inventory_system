from pydantic import BaseModel
from datetime import datetime


class ProductCreate(BaseModel):
    name: str
    price: int
    stock: int


class InventoryResponse(BaseModel):
    stock: int

    class Config:
        orm_mode = True


class ProductResponse(BaseModel):
    id: int
    name: str
    price: int
    created_at: datetime
    inventory: InventoryResponse

    class Config:
        orm_mode = True