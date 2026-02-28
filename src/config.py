import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

DB_HOST = os.getenv("MYSQL_HOST", os.getenv("DB_HOST", "localhost"))
DB_PORT = os.getenv("MYSQL_PORT", os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("MYSQL_USER", os.getenv("DB_USER", "root"))
DB_PASSWORD = quote_plus(os.getenv("MYSQL_PASSWORD", os.getenv("DB_PASSWORD", "")))
DB_NAME = os.getenv("MYSQL_DB", os.getenv("DB_NAME", "inventory_db"))

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
