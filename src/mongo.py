from pymongo import MongoClient
from .config import os

import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

client = MongoClient(MONGO_URI)
mongo_db = client[MONGO_DB]

logs_collection = mongo_db["activity_logs"]