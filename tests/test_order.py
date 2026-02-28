from fastapi.testclient import TestClient
from src.main import app
from uuid import uuid4

client = TestClient(app)  

def test_create_order():
    unique_email = f"test_{uuid4().hex[:8]}@example.com"
    user_response = client.post(
        "/users",
        json={
            "name": "Test_User_Order",
            "email": unique_email,
            "password": "testpass12"
        },
    )
    assert user_response.status_code == 200
    user_id = user_response.json()["id"]

    product_response = client.post(
        "/products",
        json={
            "name": f"TestProduct-{uuid4().hex[:6]}",
            "price": 1000,
            "stock": 5
        }
    )
    assert product_response.status_code == 200
    product_id = product_response.json()["id"]

    response = client.post(
        "/orders",
        json={
            "user_id": user_id,
            "items": [
                {"product_id": product_id, "quantity": 1}
            ]
        }
    )

    assert response.status_code == 200
    assert len(response.json()["items"]) == 1
