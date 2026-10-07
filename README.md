# Rent Management System

A simple web-based **Rent Management System** built with Flask, SQLite,
HTML, CSS, and JavaScript.

The system allows users to manage tenant and rental information through
a clean web interface.

## Features

-   Add tenant records
-   Store tenant name
-   Store property / room information
-   Store monthly rent
-   Store due date
-   Store contact number
-   Track payment status
-   View tenant records
-   Search tenant records
-   Edit tenant records
-   Delete tenant records
-   Dashboard showing:
    -   Total tenants
    -   Total rent
    -   Pending payments

## Technologies Used

-   **Backend:** Python, Flask
-   **Database:** SQLite
-   **Frontend:** HTML, CSS, JavaScript
-   **API:** REST-style Flask API

## Project Structure

``` text
Rent_Management_System/
│
├── app.py
├── students.db
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
├── venv/
│
└── README.md
```

## How to Run

### 1. Open the project directory

``` bash
cd ~/Rent_Management_System
```

### 2. Activate the virtual environment

``` bash
source venv/bin/activate
```

### 3. Start the Flask server

``` bash
python app.py
```

The application runs locally on:

``` text
http://127.0.0.1:5002
```

Open this address in a browser.

## API Endpoints

### Get all records

``` http
GET /api/students
```

### Add a tenant

``` http
POST /api/students
```

Example JSON:

``` json
{
  "name": "Test Tenant",
  "roll_no": "ROOM-101",
  "class_name": "Flat A",
  "marks": 25000,
  "contact": "1234567890"
}
```

In the current project, the inherited field names are mapped as follows:

  Original Field   Rent System Meaning
  ---------------- --------------------------
  `name`           Tenant Name
  `roll_no`        Property / Room
  `class_name`     Property Type / Category
  `marks`          Monthly Rent
  `contact`        Contact Number

### Update a tenant

``` http
PUT /api/students/<id>
```

### Delete a tenant

``` http
DELETE /api/students/<id>
```

## Database

The application uses SQLite for local data storage.

The database file is:

``` text
students.db
```

The database is created/initialized by the Flask application.

## Dashboard

The web interface provides a dashboard displaying:

-   Total number of tenants
-   Total monthly rent
-   Pending payments

Tenant records are displayed in a table with options for managing
individual records.

## Future Improvements

Possible future improvements include:

-   Properly rename inherited database/API field names to
    rental-specific names
-   Authentication and admin login
-   Property management
-   Multiple payment records per tenant
-   Automatic overdue-payment detection
-   Rent payment history
-   Monthly reports
-   Export records to CSV/PDF
-   Cloud database integration
-   Deployment to a production server

## Author

**Safalya Mohod**

B.Tech -- Electronics and Communication Engineering

## License

This project is intended for academic and educational use.
