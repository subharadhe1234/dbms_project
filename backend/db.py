# db.py
import os
import mysql.connector
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

def get_connection(database=None):
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=database or os.getenv("DB_NAME"),
    )
