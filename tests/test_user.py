from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_create_user():
    response = client.post(
        "/users",
        json={
            "name": "Test_User_12",
            "email": "test12@example.com",
            "password": "testpass12"
        },
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test12@example.com"


def test_get_user():
    response = client.get("/users/1")
    assert response.status_code == 200