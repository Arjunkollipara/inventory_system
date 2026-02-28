from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Order, OrderItem, Product, Inventory
from ..schemas.order import OrderCreate, OrderResponse
from ..mongo import logs_collection
from datetime import datetime

router = APIRouter()

@router.get("/logs")
def get_logs(start_date: str = None, end_date: str = None):

    query = {}

    if start_date and end_date:
        query["timestamp"] = {
            "$gte": datetime.fromisoformat(start_date),
            "$lte": datetime.fromisoformat(end_date)
        }

    logs = list(logs_collection.find(query, {"_id": 0}))
    return logs


@router.get("/orders", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.id.desc()).all()


@router.post("/orders", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):

    try:
        db_order = Order(user_id=order.user_id)
        db.add(db_order)
        db.flush()  # get order.id without committing

        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            inventory = db.query(Inventory).filter(
                Inventory.product_id == item.product_id
            ).first()

            if not product or not inventory:
                raise HTTPException(status_code=404, detail="Product not found")

            if inventory.stock < item.quantity:
                raise HTTPException(status_code=400, detail="Insufficient stock")

            inventory.stock -= item.quantity

            db_item = OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity
            )

            db.add(db_item)

        db.commit()
        db.refresh(db_order)
        log_document = {
            "user_id": order.user_id,
            "action": "ORDER_CREATED",
            "order_id": db_order.id,
            "items": [item.dict() for item in order.items],
            "timestamp": datetime.utcnow()
        }

        logs_collection.insert_one(log_document)
        return db_order

    except:
        db.rollback()
        raise
