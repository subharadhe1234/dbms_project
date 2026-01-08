from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection


# try:
#     conn = get_connection()
#     print("✅ Connected to MySQL successfully")
#     conn.close()
# except Exception as e:
#     print("❌ Error:", e)


app = Flask(__name__)
CORS(app)

# =====================================
# 1️⃣ SHOW ALL TABLES
# =====================================
@app.route("/api/tables", methods=["GET"])
def show_tables():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SHOW TABLES")
    tables = [t[0] for t in cur.fetchall()]
    return jsonify(tables)

# =====================================
# 2️⃣ TABLE SCHEMA
# =====================================
@app.route("/api/tables/<table>/schema", methods=["GET"])
def table_schema(table):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(f"DESCRIBE {table}")
    return jsonify(cur.fetchall())

# =====================================
# 3️⃣ VIEW TABLE DATA
# =====================================
@app.route("/api/tables/<table>/data", methods=["GET"])
def table_data(table):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(f"SELECT * FROM {table}")
    return jsonify(cur.fetchall())

# =====================================
# 4️⃣ INSERT DATA (ANY TABLE)
# =====================================
@app.route("/api/tables/<table>/insert", methods=["POST"])
def insert_data(table):
    data = request.json
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {table} ({columns}) VALUES ({placeholders})",
        tuple(data.values())
    )
    conn.commit()
    return jsonify({"message": "Inserted successfully"})

# =====================================
# 5️⃣ UPDATE DATA (Composite Key Safe)
# =====================================
@app.route("/api/tables/<table>/update", methods=["PUT"])
def update_data(table):
    body = request.json
    where = body["where"]
    data = body["data"]

    set_clause = ", ".join([f"{k}=%s" for k in data])
    where_clause = " AND ".join([f"{k}=%s" for k in where])

    values = list(data.values()) + list(where.values())

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {table} SET {set_clause} WHERE {where_clause}",
        values
    )
    conn.commit()
    return jsonify({"message": "Updated successfully"})

# =====================================
# 6️⃣ DELETE DATA
# =====================================
@app.route("/api/tables/<table>/delete", methods=["DELETE"])
def delete_data(table):
    where = request.json["where"]
    clause = " AND ".join([f"{k}=%s" for k in where])

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        f"DELETE FROM {table} WHERE {clause}",
        tuple(where.values())
    )
    conn.commit()
    return jsonify({"message": "Deleted successfully"})

# =====================================
# 7️⃣ CUSTOM SQL EXECUTOR (phpMyAdmin feature)
# =====================================
@app.route("/api/sql", methods=["POST"])
def run_sql():
    query = request.json["query"]

    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(query)

    if query.strip().lower().startswith("select"):
        return jsonify(cur.fetchall())
    else:
        conn.commit()
        return jsonify({"message": "Query executed"})

# =====================================
# 8️⃣ COMMON JOIN QUERY (EXAMPLE)
# =====================================
@app.route("/api/reports/student-courses", methods=["GET"])
def student_courses():
    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT s.Name AS Student,
               c.Title AS Course,
               e.Grade,
               ad.Name AS Department
        FROM Student s
        JOIN Enrolled_In e ON s.Name = e.Name AND s.DOB = e.DOB
        JOIN Course c ON e.Title = c.Title AND e.Year = c.Year
        JOIN Academic_Department ad ON c.Department_Name = ad.Name
    """)
    return jsonify(cur.fetchall())

# =====================================
# RUN SERVER
# =====================================
if __name__ == "__main__":
    app.run(debug=True)
