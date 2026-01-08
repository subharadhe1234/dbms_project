import mysql.connector

# db.py
import mysql.connector

def get_connection(database="university"):
    return mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="krishna",
        database=database
    )
