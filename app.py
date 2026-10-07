from flask import Flask, render_template, request, jsonify
import sqlite3
import re

app = Flask(__name__)

DATABASE = "students.db"


# ==============================
# DATABASE CONNECTION
# ==============================

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# ==============================
# DATABASE INITIALIZATION
# ==============================

def init_db():
    conn = sqlite3.connect(DATABASE)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_no TEXT NOT NULL UNIQUE,
            class_name TEXT NOT NULL,
            marks REAL NOT NULL,
            contact TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# ==============================
# HOME PAGE
# ==============================

@app.route("/")
def home():
    return render_template("index.html")


# ==============================
# GET ALL STUDENTS / SEARCH
# ==============================

@app.route("/api/students", methods=["GET"])
def get_students():

    search = request.args.get("search", "").strip()

    conn = get_db_connection()

    if search:
        students = conn.execute("""
            SELECT * FROM students
            WHERE name LIKE ?
               OR roll_no LIKE ?
        """, (f"%{search}%", f"%{search}%")).fetchall()
    else:
        students = conn.execute("""
            SELECT * FROM students
            ORDER BY id DESC
        """).fetchall()

    conn.close()

    return jsonify([dict(student) for student in students])


# ==============================
# ADD STUDENT
# ==============================

@app.route("/api/students", methods=["POST"])
def add_student():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    name = str(data.get("name", "")).strip()
    roll_no = str(data.get("roll_no", "")).strip()
    class_name = str(data.get("class_name", "")).strip()
    marks = data.get("marks")
    contact = str(data.get("contact", "")).strip()

    # Required fields
    if not name or not roll_no or not class_name or marks is None or not contact:
        return jsonify({
            "error": "All fields are required"
        }), 400

    # Marks validation
    try:
        marks = float(marks)
    except (ValueError, TypeError):
        return jsonify({
            "error": "Marks must be a valid number"
        }), 400

    # Contact validation

    conn = get_db_connection()

    # Duplicate roll number
    existing_student = conn.execute("""
        SELECT id FROM students
        WHERE roll_no = ?
    """, (roll_no,)).fetchone()

    if existing_student:
        conn.close()

        return jsonify({
            "error": "Roll number already exists"
        }), 400

    conn.execute("""
        INSERT INTO students
        (name, roll_no, class_name, marks, contact)
        VALUES (?, ?, ?, ?, ?)
    """, (
        name,
        roll_no,
        class_name,
        marks,
        contact
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Student added successfully"
    }), 201


# ==============================
# UPDATE STUDENT
# ==============================

@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    name = str(data.get("name", "")).strip()
    roll_no = str(data.get("roll_no", "")).strip()
    class_name = str(data.get("class_name", "")).strip()
    marks = data.get("marks")
    contact = str(data.get("contact", "")).strip()

    if not name or not roll_no or not class_name or marks is None or not contact:
        return jsonify({
            "error": "All fields are required"
        }), 400

    try:
        marks = float(marks)
    except (ValueError, TypeError):
        return jsonify({
            "error": "Marks must be a valid number"
        }), 400

    conn = get_db_connection()

    # Check student exists
    student = conn.execute("""
        SELECT id FROM students
        WHERE id = ?
    """, (student_id,)).fetchone()

    if not student:
        conn.close()

        return jsonify({
            "error": "Student not found"
        }), 404

    # Check duplicate roll number
    duplicate = conn.execute("""
        SELECT id FROM students
        WHERE roll_no = ?
        AND id != ?
    """, (roll_no, student_id)).fetchone()

    if duplicate:
        conn.close()

        return jsonify({
            "error": "Roll number already exists"
        }), 400

    conn.execute("""
        UPDATE students
        SET name = ?,
            roll_no = ?,
            class_name = ?,
            marks = ?,
            contact = ?
        WHERE id = ?
    """, (
        name,
        roll_no,
        class_name,
        marks,
        contact,
        student_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Student updated successfully"
    })


# ==============================
# DELETE STUDENT
# ==============================

@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):

    conn = get_db_connection()

    student = conn.execute("""
        SELECT id FROM students
        WHERE id = ?
    """, (student_id,)).fetchone()

    if not student:
        conn.close()

        return jsonify({
            "error": "Student not found"
        }), 404

    conn.execute("""
        DELETE FROM students
        WHERE id = ?
    """, (student_id,))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Student deleted successfully"
    })


# ==============================
# START APPLICATION
# ==============================

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5002)
