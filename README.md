# HRMS Lite - Premium Human Resource Management System

A sleek, lightweight, and high-performance Human Resource Management System built with a modern "Midnight Glass" aesthetic. Designed for efficiency and visual excellence, this tool allows administrators to manage employee records and track daily attendance with precision.

## 🚀 Live Demo & Repository
- **Frontend URL:** [Add your deployed frontend URL here]
- **Backend API URL:** [Add your deployed backend URL here]
- **GitHub Repository:** [Add your GitHub repo link here]

## ✨ Key Features

### 🏢 Employee Management
- **Talent Hub:** Centralized dashboard for managing all employee records.
- **Dynamic Onboarding:** Seamlessly add new employees with ID, Name, Email, and Department.
- **Member Insights:** High-fidelity "View Profile" modal for detailed member review.
- **Real-time Updates:** Instant "Edit Details" functionality with live persistence.
- **Offboarding:** Secure employee deletion from the system.

### 📅 Attendance Tracking
- **Precision Logging:** Log daily attendance (Present/Absent) with a tactile UI.
- **Intelligent Upsert:** Automated logic to prevent duplicate entries; updates existing logs if re-marked.
- **Historical Analysis:** Filter and view attendance records by date to monitor workforce presence.

### 📊 Executive Dashboard
- **Real-time Metrics:** Instant summary of total employees, participation rates, and daily status.
- **Trend Analysis:** Visual weekly attendance charts for strategic insights.
- **Efficiency Rating:** Automated calculation of organizational participation.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4 (Custom Premium Aesthetic)
- **Icons:** Lucide React
- **Routing:** React Router 7
- **API Client:** Axios

### Backend
- **Framework:** FastAPI (Python 3.13)
- **Database:** PostgreSQL / SQLAlchemy ORM
- **Validation:** Pydantic V2 / Email Validator
- **Server:** Uvicorn with Auto-reload

## ⚙️ Local Setup Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database

### Backend Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/db_name
   ```
5. Start the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### Frontend Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛡️ Validation & Error Handling
- **Server-side:** Strict Pydantic models for data integrity, duplicate record prevention, and valid email formats.
- **UI States:** Built-in loaders, empty state illustrations, and descriptive error notifications for a production-ready experience.

## 📝 Assumptions & Limitations
- Single Admin access for simplified HR operations.
- Data persistence relies on a PostgreSQL instance.
- No built-in authentication for this version (out of scope).

---
**Developed with ❤️ for the HRMS Lite Assignment.**
