from fastapi import FastAPI
from .database import engine
from sqlalchemy import text
from .database import engine
from . import models
from .routes import user_routes
from .routes import product_routes
from .routes import order_routes
from fastapi.middleware.cors import CORSMiddleware



models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(user_routes.router)
app.include_router(product_routes.router)
app.include_router(order_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"db_status": "connected"}