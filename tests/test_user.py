from fastapi.testclient import TestClient
from src.main import app
from uuid import uuid4

client = TestClient(app)


def test_create_user():
    unique_email = f"test_{uuid4().hex[:8]}@example.com"
    response = client.post(
        "/users",
        json={
            "name": "Test_User_12",
            "email": unique_email,
            "password": "testpass12"
        },
    )
    assert response.status_code == 200
    assert response.json()["email"] == unique_email


def test_get_user():
    unique_email = f"test_{uuid4().hex[:8]}@example.com"
    create_response = client.post(
        "/users",
        json={
            "name": "Test_User_13",
            "email": unique_email,
            "password": "testpass13"
        },
    )
    assert create_response.status_code == 200
    user_id = create_response.json()["id"]

    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
