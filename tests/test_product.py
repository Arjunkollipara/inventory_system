from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_create_product():
    response = client.post(
        "/products",
        json={
            "name": "TestProduct",
            "price": 1000,
            "stock": 5
        }
    )

    assert response.status_code == 200
    assert response.json()["inventory"]["stock"] == 5