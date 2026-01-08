from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

# ===============================
# SECURITY WHITELISTS
# ===============================
ALLOWED_DATABASES = ["university", "publication"]
ALLOWED_TABLES = [
    "student", "course", "enrolled_in",
    "academic_department","researcher", "lab_equipment", "uses","journal_issue","research_paper","authors"
]

# ===============================
# HEALTH CHECK
# ===============================
@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "Multi-Database API is running"
    })


# ===============================
# 1️⃣ SHOW ALL TABLES
# ===============================
@app.route("/api/<db>/tables", methods=["GET"])
def show_tables(db):
    if db.lower() not in ALLOWED_DATABASES:
        return jsonify({"error": "Invalid database"}), 400

    conn = get_connection(db)
    cur = conn.cursor()
    cur.execute("SHOW TABLES")
    tables = [t[0] for t in cur.fetchall()]
    conn.close()

    return jsonify({"database": db, "tables": tables})


# ===============================
# 2️⃣ TABLE SCHEMA
# ===============================
@app.route("/api/<db>/tables/<table>/schema", methods=["GET"])
def table_schema(db, table):
    if db.lower() not in ALLOWED_DATABASES or table.lower() not in ALLOWED_TABLES:
        return jsonify({"error": "Invalid database or table"}), 400

    conn = get_connection(db)
    cur = conn.cursor(dictionary=True)
    cur.execute(f"DESCRIBE {table}")
    data = cur.fetchall()
    conn.close()

    return jsonify(data)


# ===============================
# 3️⃣ VIEW TABLE DATA
# ===============================
@app.route("/api/<db>/tables/<table>/data", methods=["GET"])
def table_data(db, table):
    if db.lower() not in ALLOWED_DATABASES or table.lower() not in ALLOWED_TABLES:
        return jsonify({"error": "Invalid database or table"}), 400

    conn = get_connection(db)
    cur = conn.cursor(dictionary=True)
    cur.execute(f"SELECT * FROM {table}")
    data = cur.fetchall()
    conn.close()

    return jsonify(data)


# ===============================
# 4️⃣ INSERT DATA
# ===============================
@app.route("/api/<db>/tables/<table>/insert", methods=["POST"])
def insert_data(db, table):
    if db.lower() not in ALLOWED_DATABASES or table.lower() not in ALLOWED_TABLES:
        return jsonify({"error": "Invalid database or table"}), 400

    data = request.json
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))

    conn = get_connection(db)
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {table} ({columns}) VALUES ({placeholders})",
        tuple(data.values())
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Inserted successfully"})


# ===============================
# 5️⃣ UPDATE DATA
# ===============================
@app.route("/api/<db>/tables/<table>/update", methods=["PUT"])
def update_data(db, table):
    if db.lower() not in ALLOWED_DATABASES or table.lower() not in ALLOWED_TABLES:
        return jsonify({"error": "Invalid database or table"}), 400

    body = request.json
    data = body["data"]
    where = body["where"]

    set_clause = ", ".join([f"{k}=%s" for k in data])
    where_clause = " AND ".join([f"{k}=%s" for k in where])

    values = list(data.values()) + list(where.values())

    conn = get_connection(db)
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {table} SET {set_clause} WHERE {where_clause}",
        values
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Updated successfully"})


# ===============================
# 6️⃣ DELETE DATA
# ===============================
@app.route("/api/<db>/tables/<table>/delete", methods=["DELETE"])
def delete_data(db, table):
    if db.lower() not in ALLOWED_DATABASES or table.lower() not in ALLOWED_TABLES:
        return jsonify({"error": "Invalid database or table"}), 400

    where = request.json["where"]
    clause = " AND ".join([f"{k}=%s" for k in where])

    conn = get_connection(db)
    cur = conn.cursor()
    cur.execute(
        f"DELETE FROM {table} WHERE {clause}",
        tuple(where.values())
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted successfully"})


# ===============================
# 7️⃣ CUSTOM SQL (LIMITED)
# ===============================
@app.route("/api/<db>/sql", methods=["POST"])
def run_sql(db):
    if db.lower() not in ALLOWED_DATABASES:
        return jsonify({"error": "Invalid database"}), 400

    query = request.json["query"]
    blocked = ["drop", "truncate", "alter"]

    if any(word in query.lower() for word in blocked):
        return jsonify({"error": "Operation not allowed"}), 403

    conn = get_connection(db)
    cur = conn.cursor(dictionary=True)
    cur.execute(query)

    if query.strip().lower().startswith("select"):
        result = cur.fetchall()
        conn.close()
        return jsonify(result)
    else:
        conn.commit()
        conn.close()
        return jsonify({"message": "Query executed"})


# ===============================
# 8️⃣ REPORT (JOIN QUERY)
# ===============================
@app.route("/api/<db>/reports/student-courses", methods=["GET"])
def student_courses(db):
    if db.lower() not in ALLOWED_DATABASES:
        return jsonify({"error": "Invalid database"}), 400

    conn = get_connection(db)
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
    data = cur.fetchall()
    conn.close()

    return jsonify(data)


# ===============================
# RUN SERVER
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
