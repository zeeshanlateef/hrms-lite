# Deployment Guide - HRMS Lite

This guide provides step-by-step instructions for deploying the **HRMS Lite** application to production using **Render** (Backend & Database) and **Vercel** (Frontend).

---

## 🏗️ Phase 1: Database Deployment (Render)

1. **Create a Database:**
   - Log in to your [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** and select **PostgreSQL**.
   - **Name:** `hrms-lite-db`
   - **Region:** Choose the one closest to your users.
   - Click **Create Database**.
2. **Copy Connection String:**
   - Once created, copy the **Internal Database URL** (for backend-to-db communication) or **External Database URL** (for your initial testing).

---

## 🚀 Phase 2: Backend Deployment (Render)

1. **Create a Web Service:**
   - Click **New +** and select **Web Service**.
   - Connect your **GitHub repository**.
2. **Configure Service:**
   - **Name:** `hrms-lite-api`
   - **Root Directory:** `backend`
   - **Language:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables:**
   - Click **Advanced** and add:
     - `DATABASE_URL`: (Paste your PostgreSQL External/Internal URL here).
4. **Deploy:** Click **Create Web Service**. Wait for the status to show **Live**.
5. **Copy API URL:** Once live, copy your backend URL (e.g., `https://hrms-lite-api.onrender.com`).

---

## 💻 Phase 3: Frontend Deployment (Vercel)

1. **Import Project:**
   - Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
   - Import your **GitHub repository**.
2. **Configure Project:**
   - **Project Name:** `hrms-lite-ui`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
3. **Environment Variables:**
   - Add the following variable:
     - `VITE_API_URL`: (Paste your live Render Backend URL here).
4. **Deploy:** Click **Deploy**.
5. **Final Touch:** Once deployed, Vercel will give you a live production URL (e.g., `https://hrms-lite-ui.vercel.app`).

---

## 🔗 Phase 4: Final Connection Check

1. **Update Frontend URL in Backend (CORS):**
   - If you encounter CORS issues, go to `backend/app/main.py` and ensure your live Vercel URL is added to the `origins` list in the CORS middleware.
2. **Update README:**
   - Open your root `README.md` and paste your live **Frontend URL** and **Backend API URL** in the placeholders provided.
   - Commit and push these changes to GitHub.

---

## 💡 Summary of Names
| Service | Recommended Name | Platform |
| :--- | :--- | :--- |
| **Database** | `hrms-lite-db` | Render |
| **Backend API** | `hrms-lite-api` | Render |
| **Frontend UI** | `hrms-lite-ui` | Vercel |

---
**Congratulations! Your premium HRMS Lite system is now production-ready.**
