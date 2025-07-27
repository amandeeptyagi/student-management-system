# 🎓 Student Management System

A full-featured web-based **Student Management System** for colleges to manage students, teachers, courses, lectures, attendance, and marks efficiently. It supports **multiple user roles** including Super Admin, Admin, Teacher, and Student, each with its own set of capabilities.

---

## 🧾 Features

### ✅ Multi-Role Access:
- **Super Admin**: Manage admins
- **Admin**: Manage students, teachers, courses, subjects, and lectures
- **Teacher**: Manage own profile, timetable, student attendance, and marks
- **Student**: View own profile, enrolled course, timetable, attendance, and marks

---

## 🧰 Tech Stack

### 🔹 Frontend:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Axios](https://axios-http.com/)
- Toast notifications

### 🔹 Backend:
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT (JSON Web Token)](https://jwt.io/) for authentication

---

## 📁 Folder Structure

```
student-management-system/
├── client/        # React + Vite frontend
├── server/        # Node.js + Express backend
```

- All frontend code (UI, API calls) is inside `client/`
- All backend logic (models, routes, controllers) is inside `server/`

---

## ⚙️ Environment Variables

### 🔐 Backend (`server/.env`)
```env
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:5173
```

### 🌐 Frontend (`client/.env`)
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/amandeeptyagi/student-management-system.git
cd student-management-system
```

### 2. Install dependencies for both frontend and backend
```bash
# In root folder
cd client
npm install

cd ../server
npm install
```

### 3. Run the project

#### 👉 Start Backend
```bash
cd server
npm run dev
```

#### 👉 Start Frontend
```bash
cd client
npm run dev
```

Now visit: `http://localhost:5173`

---

## 🔐 Authentication & Roles

- JWT-based authentication
- Role-based access control for:
  - Super Admin
  - Admin
  - Teacher
  - Student

---

## 👨‍💻 Author

> Made with ❤️ by Amandeep Tyagi

>🙏If you like this repo please give a star⭐😊.  


---

> ⚠️ This project is in active development. More features and improvements are coming soon.
