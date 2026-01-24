# User Management Backend System

A secure and scalable backend system built using **Node.js, Express, and MySQL**, implementing **JWT-based authentication**, **role-based access control**, and **brute-force attack protection**.  
This project follows clean backend architecture principles and is designed to be production-ready.

---

## 🚀 Features

- User Signup & Login
- JWT-based Stateless Authentication
- Password Hashing using bcrypt
- Role-Based Access Control (Admin/User)
- Brute-force Login Protection (Account Locking)
- User Profile Management
- Admin User Management (Block / Unblock Users)
- Input Validation using express-validator
- Centralized Error Handling
- Environment-based Configuration
- Fully tested using Postman

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MySQL**
- **JWT (JSON Web Tokens)**
- **bcrypt**
- **express-validator**
- **Postman**

---

## 📂 Project Structure

BACKEND-MAIN/
│
├── .env
├── .gitignore
├── package.json
├── backend/
│ ├── app.js
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ └── user.controller.js
│ ├── services/
│ │ ├── auth.service.js
│ │ └── user.service.js
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ ├── validation.middleware.js
│ │ └── error.middleware.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ └── user.routes.js
│ └── utils/
│ └── response.util.js

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=mydb
JWT_SECRET=your_secure_jwt_secret

```
---

## 🗄️ Database Schema

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  failed_attempts INT DEFAULT 0,
  lock_until DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

```
---

## ▶️ Running the Project

Install Dependencies
npm install

Start Server
node backend/app.js

Server will run on:
http://localhost:3000

---

## 🔐 API Endpoints

Auth Routes
Method	        Endpoint	           Description
POST	    /api/auth/signup	     Register new user
POST	    /api/auth/login	         Login & receive JWT

User Routes
Method	        Endpoint	             Access
GET	         /api/users/me	          Authenticated
PATCH	     /api/users/me	          Authenticated
PATCH	  /api/users/me/password	  Authenticated
GET	          /api/users	            Admin only
PATCH	  /api/users/:id/block	        Admin only
PATCH	 /api/users/:id/unblock	        Admin only

---

## 🔒 Security Highlights

- Passwords stored only as bcrypt hashes
- JWT tokens signed with secret key
- No token storage on server (stateless auth)
- Brute-force protection using login attempt tracking
- Role-based authorization enforced via middleware

---

## 🧪 Testing

- All endpoints were tested using Postman, including:
- Authentication flows
- JWT protection
- Role-based access control
- Brute-force lock logic
- Error handling

---

## 🧠 Learning Outcomes

- Designed a clean backend architecture
- Implemented real-world authentication & authorization
- Handled security edge cases (brute-force attacks)
- Worked with MySQL safely using parameterized queries
- Built a production-style REST API

---

## 👤 About me

Darvish
Backend Developer | Node.js | MySQL | Security-focused APIs