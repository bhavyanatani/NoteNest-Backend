# 🧠 NoteNest – Backend

This is the **backend** of the NoteNest application — a RESTful API built with **Node.js**, **Express**, and **MongoDB**.  
It handles user authentication, note management, and secure data storage.

## 🚀 Features
- User authentication using JWT
- Passwords hashed with bcrypt
- CRUD operations for notes
- Middleware for route protection (`fetchuser`)
- MongoDB database connection
- Input validation and error handling

## 🧩 Tech Stack
- **Node.js + Express.js** – Server and routing  
- **MongoDB + Mongoose** – Database and schema modeling  
- **bcrypt.js** – Password hashing  
- **jsonwebtoken** – Authentication via JWT  
- **Express Validator** – Input validation  
- **CORS** – Enable cross-origin requests

## ⚙️ Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/bhavyanatani/NoteNest-Backend.git
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. **Start the server**
   ```bash
   nodemon index.js
   ```
   or
   ```bash
   node index.js
   ```

## 📂 Folder Structure
```
NoteNest-Backend/
├── routes/
│   ├── auth.js
│   └── notes.js
├── models/
│   ├── User.js
│   └── Note.js
├── middleware/
│   └── fetchuser.js
├── db.js
├── index.js
├── package.json
└── README.md
```

## 🧑‍💻 Author
**Bhavya Natani**  
B.Tech, IIEST Shibpur
