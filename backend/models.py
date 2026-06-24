from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel


class ProductBase(SQLModel):
    title: str = Field(default=None)
    description: str | None = Field(default=None)
    price: float = Field(default=None)
    stock: int = Field(default=0, ge=0)
    img: str = Field(default=None)

class ProductCreate(ProductBase):
    pass


class Product(ProductBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    movements: list["Movement"] = Relationship(back_populates="product")


class MovementBase(SQLModel):
    employee: str = Field(default=None)
    quantity: int = Field(default=1, gt=0)
    date: datetime = Field(default_factory=datetime.utcnow)
    type: bool = Field(default=True)
    stock_total: int = Field(default=0, ge=0)


class MovementCreate(MovementBase):
    product_id: int = Field(foreign_key="product.id")
    employee: str | None = Field(default=None, exclude=True)
    date: datetime = Field(default_factory=datetime.utcnow)
    stock_total: int | None = Field(default=None, exclude=True)


class Movement(MovementBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    product: Product = Relationship(back_populates="movements")


class MovementListItem(MovementBase):
    id: int
    product_id: int
    product: str

