import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")
MONGO_URI = os.getenv("MONGO_URI", f"mongodb://{MONGO_HOST}:{MONGO_PORT}")
MONGO_DB = os.getenv("MONGO_DB", "inventory_logs")

client = MongoClient(MONGO_URI)
mongo_db = client[MONGO_DB]

logs_collection = mongo_db["activity_logs"]
