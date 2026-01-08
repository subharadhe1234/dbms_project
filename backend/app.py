from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
from mysql.connector.errors import IntegrityError


app = Flask(__name__)
CORS(app)

# ===============================
# SECURITY WHITELISTS
# ===============================
ALLOWED_DATABASES = ["university", "research"]

ALLOWED_TABLES = {
    "university": [
        "academic_department",
        "classified_under",
        "course",
        "enrolled_in",
        "final_project",
        "instructor",
        "student",
        "subject_area",
        "taught_by",
    ],
    "research": [
        "authors",
        "journal_issue",
        "lab_equipment",
        "research_paper",
        "researcher",
        "uses",
    ],
}


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
    if (
        db.lower() not in ALLOWED_DATABASES
        or table.lower() not in ALLOWED_TABLES.get(db.lower(), [])
    ):
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
    if (
    db.lower() not in ALLOWED_DATABASES
    or table.lower() not in ALLOWED_TABLES.get(db.lower(), [])
    ):
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
    if (
    db.lower() not in ALLOWED_DATABASES
    or table.lower() not in ALLOWED_TABLES.get(db.lower(), [])
    ):return jsonify({"error": "Invalid database or table"}), 400


    data = request.json

    if not data or len(data) == 0:
        return jsonify({"error": "No data provided"}), 400

    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    values = tuple(data.values())

    try:
        conn = get_connection(db)
        cur = conn.cursor()

        cur.execute(
            f"INSERT INTO {table} ({columns}) VALUES ({placeholders})",
            values
        )

        conn.commit()
        conn.close()

        return jsonify({"message": "Inserted successfully"}), 201

    except IntegrityError as e:
        msg = str(e).lower()

        # 🔑 DUPLICATE PRIMARY KEY (Composite or Single)
        if "duplicate" in msg:
            return jsonify({
                "error": "Duplicate primary key value. This row already exists."
            }), 409

        # 🔗 FOREIGN KEY VIOLATION
        if "foreign key constraint fails" in msg:
            return jsonify({
                "error": (
                    "Foreign key constraint failed. "
                    "Referenced value does not exist in parent table."
                )
            }), 409

        # ❓ OTHER INTEGRITY ISSUE
        return jsonify({
            "error": "Integrity constraint violation"
        }), 409

    except Exception as e:
        return jsonify({
            "error": "Insert failed due to server error",
            "details": str(e)
        }), 500



# ===============================
# 5️⃣ UPDATE DATA
# ===============================
@app.route("/api/<db>/tables/<table>/update", methods=["PUT"])
def update_data(db, table):
    if (
    db.lower() not in ALLOWED_DATABASES
    or table.lower() not in ALLOWED_TABLES.get(db.lower(), [])
    ):return jsonify({"error": "Invalid database or table"}), 400

    body = request.json

    if not body or "data" not in body or "where" not in body:
        return jsonify({"error": "Invalid request format"}), 400

    data = body["data"]
    where = body["where"]

    if not data or not where:
        return jsonify({
            "error": "Update data or primary key missing"
        }), 400

    set_clause = ", ".join([f"{k}=%s" for k in data])
    where_clause = " AND ".join([f"{k}=%s" for k in where])
    values = list(data.values()) + list(where.values())

    try:
        conn = get_connection(db)
        cur = conn.cursor()

        cur.execute(
            f"UPDATE {table} SET {set_clause} WHERE {where_clause}",
            values
        )

        conn.commit()

        # 🔍 No row matched WHERE clause
        if cur.rowcount == 0:
            conn.close()
            return jsonify({
                "error": "No matching row found to update"
            }), 404

        conn.close()
        return jsonify({"message": "Updated successfully"}), 200

    except IntegrityError as e:
        msg = str(e).lower()

        # 🔗 FOREIGN KEY VIOLATION
        if "foreign key constraint fails" in msg:
            return jsonify({
                "error": (
                    "Foreign key constraint failed. "
                    "Referenced value does not exist or is in use."
                )
            }), 409

        # 🔑 DUPLICATE PRIMARY KEY (composite or single)
        if "duplicate" in msg:
            return jsonify({
                "error": "Duplicate primary key value. Update not allowed."
            }), 409

        # ❓ OTHER INTEGRITY ISSUE
        return jsonify({
            "error": "Integrity constraint violation"
        }), 409

    except Exception as e:
        return jsonify({
            "error": "Update failed due to server error",
            "details": str(e)
        }), 500


# ===============================
# 6️⃣ DELETE DATA
# ===============================
@app.route("/api/<db>/tables/<table>/delete", methods=["DELETE"])
def delete_data(db, table):
    if (
    db.lower() not in ALLOWED_DATABASES
    or table.lower() not in ALLOWED_TABLES.get(db.lower(), [])
    ):return jsonify({"error": "Invalid database or table"}), 400

    body = request.json

    if not body or "where" not in body:
        return jsonify({"error": "Delete condition missing"}), 400

    where = body["where"]

    if not where or len(where) == 0:
        return jsonify({
            "error": "Primary key condition required for delete"
        }), 400

    clause = " AND ".join([f"{k}=%s" for k in where])
    values = tuple(where.values())

    try:
        conn = get_connection(db)
        cur = conn.cursor()

        cur.execute(
            f"DELETE FROM {table} WHERE {clause}",
            values
        )

        conn.commit()

        # 🔍 No row matched
        if cur.rowcount == 0:
            conn.close()
            return jsonify({
                "error": "No matching row found to delete"
            }), 404

        conn.close()
        return jsonify({"message": "Deleted successfully"}), 200

    except IntegrityError as e:
        msg = str(e).lower()

        # 🔗 FOREIGN KEY DEPENDENCY
        if "foreign key constraint fails" in msg:
            return jsonify({
                "error": (
                    "Cannot delete this row because it is referenced "
                    "by another table (foreign key constraint)"
                )
            }), 409

        # ❓ OTHER INTEGRITY ISSUE
        return jsonify({
            "error": "Integrity constraint violation"
        }), 409

    except Exception as e:
        return jsonify({
            "error": "Delete failed due to server error",
            "details": str(e)
        }), 500



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
