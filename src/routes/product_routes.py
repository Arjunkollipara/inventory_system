from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Product, Inventory
from ..schemas.product import ProductCreate, ProductResponse

router = APIRouter()


@router.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    db_product = Product(
        name=product.name,
        price=product.price
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    db_inventory = Inventory(
        product_id=db_product.id,
        stock=product.stock
    )

    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)

    return db_product


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    return product