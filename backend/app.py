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
        "office",
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
#  SHOW ALL TABLES
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
#  TABLE SCHEMA
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
# VIEW TABLE DATA
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
# INSERT DATA
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

        

        if "duplicate" in msg:
            return jsonify({
                "error": "Duplicate  key value. Update not allowed."
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
# UPDATE DATA
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
                "error": "Duplicate  key value. Update not allowed."
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
#  DELETE DATA
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
#  CUSTOM SQL 
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
# REPORT 
# ===============================
@app.route("/api/<db>/reports", methods=["GET"])
def list_reports(db):
    db = db.lower()

    if db not in ALLOWED_DATABASES:
        return jsonify({"error": "Invalid database"}), 400

    if db == "research":
        reports = [
            {"id": "journal-summary", "title": "Journal-wise Paper & Author Statistics"},
            {"id": "editor-not-author", "title": "Editors Who Did Not Author Papers"},
            {"id": "inactive-researchers", "title": "Researchers Using Equipment but No Papers"},
            {"id": "max-paper-journals", "title": "Journals with Maximum Papers"},
            {"id": "shared-office-different-equipment", "title": "Same Office, Different Equipment Usage"},
        ]

    elif db == "university":
        reports = [
            {"id": "dept-course-count", "title": "Department-wise Course Count"},
            {"id": "course-enrollment", "title": "Course-wise Enrollment Statistics"},
            {"id": "students-no-course", "title": "Students Not Enrolled in Any Course"},
            {"id": "dept-max-courses", "title": "Department Offering Maximum Courses"},
            { "id": "course-final-projects", "title": "Course-wise Final Project Count" }
        ]

    else:
        reports = []

    return jsonify({"reports": reports}), 200

@app.route("/api/<db>/reports/<report_id>", methods=["GET"])
def get_report(db, report_id):
    db = db.lower()

    if db not in ALLOWED_DATABASES:
        return jsonify({"error": "Invalid database"}), 400

    try:
        conn = get_connection(db)
        cur = conn.cursor(dictionary=True)

        # ===================== RESEARCH REPORTS =====================
        if db == "research":

            if report_id == "journal-summary":
                title = "Journal-wise Paper & Author Statistics"
                query = """
                SELECT
                  j.Title AS journal_title,
                  j.Volume_Id,
                  COUNT(DISTINCT p.Paper_Id) AS total_papers,
                  COUNT(DISTINCT a.Employee_Id) AS total_authors,
                  r.Name AS editor_in_chief
                FROM Journal_Issue j
                JOIN Researcher r
                  ON j.Editor_In_Chief = r.Employee_Id
                LEFT JOIN Research_Paper p
                  ON p.Volume_Id = j.Volume_Id
                 AND p.Journal_Title = j.Title
                LEFT JOIN Authors a
                  ON a.Paper_Id = p.Paper_Id
                GROUP BY j.Volume_Id, j.Title, r.Name
                """

            elif report_id == "editor-not-author":
                title = "Editors Who Did Not Author Papers"
                query = """
                SELECT
                  j.Volume_Id,
                  j.Title AS journal_title,
                  r.Name AS editor_name
                FROM Journal_Issue j
                JOIN Researcher r
                  ON j.Editor_In_Chief = r.Employee_Id
                WHERE NOT EXISTS (
                  SELECT 1
                  FROM Research_Paper p
                  JOIN Authors a ON a.Paper_Id = p.Paper_Id
                  WHERE p.Volume_Id = j.Volume_Id
                    AND p.Journal_Title = j.Title
                    AND a.Employee_Id = j.Editor_In_Chief
                )
                """

            elif report_id == "inactive-researchers":
                title = "Researchers Using Equipment but No Papers"
                query = """
                SELECT DISTINCT
                  r.Employee_Id,
                  r.Name
                FROM Researcher r
                JOIN Uses u ON r.Employee_Id = u.Employee_Id
                LEFT JOIN Authors a ON r.Employee_Id = a.Employee_Id
                WHERE a.Employee_Id IS NULL
                """

            elif report_id == "max-paper-journals":
                title = "Journals with Maximum Papers"
                query = """
                SELECT
                  Volume_Id,
                  Journal_Title,
                  COUNT(*) AS paper_count
                FROM Research_Paper
                GROUP BY Volume_Id, Journal_Title
                HAVING COUNT(*) = (
                  SELECT MAX(cnt)
                  FROM (
                    SELECT COUNT(*) AS cnt
                    FROM Research_Paper
                    GROUP BY Volume_Id, Journal_Title
                  ) x
                )
                """

            elif report_id == "shared-office-different-equipment":
                title = "Same Office, Different Equipment Usage"
                query = """
                SELECT DISTINCT
                  r1.Employee_Id AS researcher_1,
                  r2.Employee_Id AS researcher_2,
                  r1.Office_Address
                FROM Researcher r1
                JOIN Researcher r2
                  ON r1.Office_Address = r2.Office_Address
                 AND r1.Employee_Id < r2.Employee_Id
                WHERE NOT EXISTS (
                  SELECT 1
                  FROM Uses u1
                  JOIN Uses u2
                    ON u1.Equipment_Name = u2.Equipment_Name
                   AND u1.Calibration_Standard = u2.Calibration_Standard
                  WHERE u1.Employee_Id = r1.Employee_Id
                    AND u2.Employee_Id = r2.Employee_Id
                )
                """
            else:
                return jsonify({"error": "Invalid report id"}), 404

        # ===================== UNIVERSITY REPORTS =====================
        elif db == "university":

            if report_id == "dept-course-count":
                title = "Department-wise Course Count"
                query = """
                SELECT
                  d.Name AS department_name,
                  COUNT(c.Title) AS total_courses
                FROM Academic_Department d
                LEFT JOIN Course c
                  ON d.Name = c.Department_Name
                GROUP BY d.Name
                """

            elif report_id == "course-enrollment":
                title = "Course-wise Enrollment Statistics"
                query = """
                SELECT
                c.Title AS course_title,
                c.Year AS course_year,
                COUNT(e.Name) AS enrolled_students
                FROM Course c
                LEFT JOIN Enrolled_In e
                ON c.Title = e.Title
                AND c.Year = e.Year
                GROUP BY c.Title, c.Year
                ORDER BY c.Title, c.Year;

                """

            elif report_id == "students-no-course":
                title = "Students Not Enrolled in Any Course"
                query = """
                SELECT
                  s.Name,
                  s.DOB
                FROM Student s
                WHERE NOT EXISTS (
                  SELECT 1
                  FROM Enrolled_In e
                  WHERE e.Name = s.Name
                    AND e.DOB = s.DOB
                )
                """

            elif report_id == "dept-max-courses":
                title = "Department Offering Maximum Courses"
                query = """
                SELECT
                  Department_Name,
                  COUNT(*) AS total_courses
                FROM Course
                GROUP BY Department_Name
                HAVING COUNT(*) = (
                  SELECT MAX(cnt)
                  FROM (
                    SELECT COUNT(*) AS cnt
                    FROM Course
                    GROUP BY Department_Name
                  ) x
                )
                """

            elif report_id == "course-final-projects":
                title = "Course-wise Final Project Count"
                query = """
                SELECT
                c.Title AS course_title,
                c.Year AS course_year,
                COUNT(fp.PId) AS total_final_projects
                FROM Course c
                LEFT JOIN Final_Project fp
                ON c.Title = fp.Title
                AND c.Year = fp.Year
                GROUP BY c.Title, c.Year
                ORDER BY c.Title, c.Year
                """

            else:
                return jsonify({"error": "Invalid report id"}), 404

        cur.execute(query)
        rows = cur.fetchall()

        return jsonify({"title": title, "data": rows}), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to generate report",
            "details": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# ===============================
# RUN SERVER
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
