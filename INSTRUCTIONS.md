# 🎵 Music Mood Matcher - Setup & Contribution Guide

This document provides detailed instructions for setting up the Music Mood Matcher project, understanding its architecture, and contributing to its development.

## 🏗️ Project Overview

Music Mood Matcher is a full-stack web application that uses AI to detect user moods via webcam and recommends music accordingly. It features a React-based PWA frontend and a Node.js/Express backend with MongoDB.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **MongoDB**: A running instance (local or Atlas)
- **Git**: For version control

---

## ⚙️ Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/KGFCH2/Music-Mood-Matcher.git
cd "Music Mood Matcher"
```

### 2. Backend Configuration
The backend handles user authentication, mood history, and profile management.

```bash
cd backend
npm install
```

**Environment Variables (`backend/.env`):**
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/music-mood-matcher
JWT_SECRET=your_super_secret_jwt_key
```

**Start Backend:**
```bash
npm start
# Server should run on http://localhost:5000
```

### 3. Frontend Configuration
The frontend is built with React and Vite, featuring on-device AI processing.

```bash
cd ../frontend
npm install
```

**Environment Variables (`frontend/.env`):**
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

**Start Frontend:**
```bash
npm run dev
# Application should be accessible at http://localhost:5173
```

---

## 🤖 AI Mood Detection

The application uses `face-api.js` for facial expression recognition.
- **📁 Models**: Weight files are located in `frontend/public/models/`.
- **📸 Detection**: Happens entirely in the browser for user privacy.
- **🧠 Emotions**: Detects Happy, Sad, Energetic (Surprised), Romantic (Neutral/Happy), Chill (Neutral), and Angry.

---

## 📱 PWA & Offline Support

Music Mood Matcher is a Progressive Web App.
- **🔌 Service Worker**: Found at `frontend/public/sw.js`. It handles asset caching for offline play.
- **📲 Installation**: Users can "Install" the app on Chrome (Android/Desktop) or Safari (iOS).

---

## 📊 Data Management

- **🗄️ Database**: MongoDB stores user profiles, encrypted passwords, and mood history.
- **🔐 State Management**: React `AuthContext` manages user sessions and authentication tokens.
- **🛡️ Secure Reset**: Password reset codes are hashed using bcrypt before storage, ensuring they are never exposed in logs or database leaks.
- **🛡️ Offline Storage**: `secureStorage.js` utility provides an additional layer of security for browser-based data.

---

## ✅ Deployment

### 🌐 Backend (e.g., Render, Heroku)
- Set environment variables on the hosting platform.
- Ensure the MongoDB URI is accessible from the host.

### 🚀 Frontend (e.g., Vercel, Netlify)
- Set `VITE_API_URL` to your deployed backend URL.
- Build command: `npm run build`
- Output directory: `dist`

---

## 🤝 Contribution Guidelines

1. **Feature Branches**: Always branch off `main` for new features or fixes.
2. **Linting**: Run `npm run lint` in the frontend directory before committing.
3. **Commit Messages**: Use clear, descriptive commit messages (e.g., `feat: add aurora effect to home`).
4. **Pull Requests**: Provide a clear description of changes and any testing performed.

---

## 📞 Support

For technical issues or feature requests, contact the development team at:
- **Babin Bid**: babinbid05@gmail.com
- **Debasmita Bose**: dbose272@gmail.com
| **Auth Controller** | `authController.js` | ✅ Complete | 🔐 Register, login, profile |
| **User Controller** | `userController.js` | ✅ Complete | 👤 Favorites, mood history, stats |
| **Auth Middleware** | `middleware/auth.js` | ✅ Complete | 🛡️ JWT verification |
| **Error Handler** | `middleware/errorHandler.js` | ✅ Complete | ⚠️ Consistent error responses |
| **User Model** | `models/User.js` | ✅ Complete | 📋 Schema with favorites & preferences |
| **MoodHistory Model** | `models/MoodHistory.js` | ✅ Complete | 📈 Schema with auto-delete (90 days) |
| **Auth Routes** | `routes/authRoutes.js` | ✅ Complete | 🚪 Register, login, profile endpoints |
| **User Routes** | `routes/userRoutes.js` | ✅ Complete | 🎵 Favorites, mood history endpoints |

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend

# Run tests in watch mode
npm test

# Run with UI dashboard
npm run test:ui

# Run linter
npm run lint
```

### Manual API Testing
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 3. Get Profile (replace TOKEN with JWT from login response)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"

# 4. Add Favorite
curl -X POST http://localhost:5000/api/user/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "songId": "song1",
    "songName": "Happy Song",
    "artist": "Artist Name",
    "mood": "happy"
  }'
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module 'node_modules'"
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: "MongoDB Connection Timeout"
**Solution:**
- Check if MongoDB is running (local) or if Atlas IP is whitelisted
- Verify MONGODB_URI in .env is correct
- Check internet connection (for Atlas)

### Issue 3: "VITE_API_URL not found"
**Solution:**
- Ensure `.env` file exists in `frontend/` folder
- Check variable name starts with `VITE_` prefix
- Restart dev server after changing .env

### Issue 4: "JWT token expired"
**Solution:**
- Token expires in 7 days (configurable via JWT_EXPIRE in .env)
- User must re-login
- Implement token refresh logic for production

### Issue 5: "Port 5000/5173 already in use"
**Solution:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

---

## 📦 Build & Deployment

### Frontend Build
```bash
cd frontend
npm run build          # Creates dist/ folder
npm run preview        # Test production build locally
```

**Deploy to:**
- **Vercel** (recommended): Connect GitHub repo
- **Netlify**: Connect GitHub, auto-deploy
- **GitHub Pages**: Use gh-pages package
- **Static hosting**: Upload `dist/` folder
CORS_ORIGIN=your_frontend_production_url
NODE_ENV=production
```

---

## 🔒 Security Checklist

✅ User data stored locally in browser localStorage
✅ No server-side data transmission
✅ AI processing client-side only
✅ EmailJS for secure contact forms
✅ PWA with service worker for caching
✅ No sensitive data stored or transmitted  

---

## 📊 Project Stats

| 📊 Metric | Value |
|--------|-------|
| Frontend Code | ~4000 lines |
| Backend Code | ~400 lines |
| Total Components | 10 |
| Build Size | ~70 KB (gzipped) |
| Songs Database | 150+ tracks |
| Supported Languages | 3 (English, Hindi, Bengali) |
| Mood Categories | 6 |
| Data Storage | Browser localStorage |

---

## 🎯 Next Steps (QUICK WINS)

### Immediate (1-2 hours):
- [ ] Test application in different browsers
- [ ] Verify PWA installation works
- [ ] Check offline functionality
- [ ] Test mood detection with webcam

### Short-term (4-6 hours):
- [ ] Add more songs to database
- [ ] Improve UI animations
- [ ] Add dark mode toggle
- [ ] Add error notifications for API failures

### Medium-term (1-2 weeks):
- [ ] Spotify API integration for music playback
- [ ] Advanced mood analytics dashboard
- [ ] Social sharing features
- [ ] Mobile app (React Native)

---

## 📝 File Checklist

### Frontend Files
```
✅ frontend/package.json             - Dependencies and scripts
✅ frontend/src/App.jsx              - Main application component
✅ frontend/src/api/apiClient.js     - Axios client (for EmailJS)
✅ frontend/src/components/          - UI components
✅ frontend/src/context/AuthContext.jsx - Authentication state
✅ frontend/src/data/songs.js        - Song database
✅ frontend/src/test/                - Test files
✅ frontend/public/                  - Static assets and PWA files
✅ frontend/vite.config.js           - Build configuration
✅ frontend/vitest.config.js         - Testing configuration
```
✅ backend/controllers/authController.js
✅ backend/controllers/userController.js
✅ backend/routes/authRoutes.js
✅ backend/routes/userRoutes.js
✅ backend/middleware/auth.js
✅ backend/middleware/errorHandler.js
```

### Frontend Files
```
✅ frontend/package.json              - Dependencies (React 18)
✅ frontend/.env                      - API URL & EmailJS config
✅ frontend/src/App.jsx               - Main app
✅ frontend/src/context/AuthContext.jsx - Auth state (localStorage-based)
✅ frontend/src/api/apiClient.js      - Axios API client with JWT
✅ frontend/src/components/Login.jsx
✅ frontend/src/components/MoodWebcam.jsx
✅ frontend/src/components/ProfileNav.jsx
✅ frontend/src/components/tabs/HomeTab.jsx - ✅ FIXED
✅ frontend/src/components/tabs/HistoryTab.jsx - ✅ FIXED
✅ frontend/src/components/tabs/FavoritesTab.jsx - ✅ FIXED
✅ frontend/public/sw.js              - Service worker
✅ frontend/public/manifest.json      - PWA manifest
✅ frontend/vite.config.js            - Build config with code splitting
✅ frontend/vitest.config.js          - Testing config
```

---

## 💡 Pro Tips

1. **Use `.env.example`** as a template when setting up new environments
2. **Keep secrets in `.env`** - never commit to Git
3. **Test API endpoints** with curl before debugging frontend
4. **Check browser console** for API errors (Network tab)
5. **Enable service worker** for offline testing
6. **Monitor MongoDB Atlas** for connection issues
7. **Use Postman/Insomnia** for API testing during development

---

## 📞 Support

**For issues:**
1. Check this file first (Common Issues section)
2. Review backend/IMPLEMENTATION_SUMMARY.md for technical details
3. Check browser console & network tab for errors
4. Review MongoDB Atlas dashboard for connection issues

**Files to review for debugging:**
- Backend errors: Check `backend/.env` and MongoDB connection
- Frontend errors: Check `frontend/.env` and API client setup
- Auth issues: Check JWT_SECRET in backend .env matches token validation

---

**Status:** Ready for Development ✅
