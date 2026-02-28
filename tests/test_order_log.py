from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)  
def test_logs_exist():
    response = client.get("/logs")
    assert response.status_code == 200

def test_logs_exist():
    response = client.get("/logs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_logs_exist():
    response = client.get("/logs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)