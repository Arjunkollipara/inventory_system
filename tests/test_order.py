from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)  

def test_create_order():
    response = client.post(
        "/orders",
        json={
            "user_id": 1,
            "items": [
                {"product_id": 1, "quantity": 1}
            ]
        }
    )

    assert response.status_code == 200
    assert len(response.json()["items"]) == 1