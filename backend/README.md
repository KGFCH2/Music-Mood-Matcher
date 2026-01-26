# 🎵 Music Mood Matcher Backend

The engine behind the Music Mood Matcher. This is a Node.js/Express server providing a secure REST API for user authentication, mood tracking, and favorites management using MongoDB.

---

## 🛠️ Tech Stack

- **🖥️ Server:** Node.js & Express
- **🗄️ Database:** MongoDB with Mongoose ODM
- **🔐 Security:** JWT (JSON Web Tokens) & bcryptjs for password hashing
- **🚀 Middleware:** CORS, JSON parsing, and global error handling

---

## ⚙️ Quick Start

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in this directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Run the Server:**
   ```bash
   npm start
   # API available at http://localhost:5000/api
   ```

---

## 🔑 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register` - Create a new user account.
- `POST /login` - Authenticate and receive a JWT.
- `GET /profile` - Retrieve current user details (Protected).
- `POST /forgot-password` - Generate a reset code.
- `POST /reset-password` - Update password using verification code.

### 🎵 User Data (`/api/user`)
- `GET /favorites` - Fetch user's saved tracks.
- `POST /favorites` - Save a new track.
- `DELETE /favorites/:id` - Remove a track from favorites.
- `POST /mood-history` - Log a new emotional session.
- `GET /mood-history` - Retrieve session logs with analytics.

---

## 📁 Structure

```
backend/
├── controllers/    # Route logic (Auth, User)
├── models/         # Mongoose Schemas (User, MoodHistory)
├── routes/         # Express Router definitions
├── middleware/     # Auth guards & Error handlers
├── db.js           # Database connection logic
└── server.js       # Entry point
```

---

## 🛡️ Security Features

- ✅ **JWT Authentication:** Secure stateless session management.
- ✅ **Password Hashing:** One-way salt + hash for user credentials.
- ✅ **CORS Integration:** Controlled access from the frontend.
- ✅ **Sanitized Responses:** No sensitive data (like password hashes) is ever sent to the client.
