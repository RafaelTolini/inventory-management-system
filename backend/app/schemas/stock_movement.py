from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class StockMovementBase(BaseModel):
    product_id: int
    type: Literal["IN", "OUT"]
    quantity: int = Field(gt=0)


class StockMovementCreate(StockMovementBase):
    pass


class StockMovementRead(BaseModel):
    id: int
    product_id: int
    type: str
    quantity: int
    timestamp: datetime

    class Config:
        from_attributes = True
