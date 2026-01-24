# Music Mood Matcher - Setup Guide

Summary:

- 🔧 This repository contains a frontend React application (Vite) and an optional backend scaffold for API endpoints.
- 📁 Large model files are not tracked to keep the repository lightweight; if you need them, place them in `frontend/public/models/`.

Quick setup

1) Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Step 3b: Configure Environment
**File:** `frontend/.env`
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Status:** ✅ **Configured**

#### Step 3c: Start Frontend Dev Server
```bash
npm run dev
# Expected: Vite server running on http://localhost:5173
```

#### Step 3d: Verify Application
In browser (`http://localhost:5173`):
- Check that the app loads
- Test login with demo credentials
- Try mood detection (allow camera permissions)
- Verify songs play in new tabs

---

### **Phase 4: Frontend Features**

#### Step 4a: Authentication Flow (localStorage)
The frontend uses localStorage for user authentication. Current flow:

```javascript
// AuthContext stores user data in localStorage
const login = (userData) => {
  setUser(userData)
  localStorage.setItem('musicMoodUser', JSON.stringify(userData))
}
```

User data, favorites, and history are stored locally in the browser.

#### Step 4b: Data Storage
All data is stored in browser localStorage:

**Auth Endpoints:**
```
POST   /api/auth/register       → Create new user
POST   /api/auth/login          → Get JWT token
GET    /api/auth/profile        → Get user profile (protected)
```

**User Endpoints (all require JWT):**
```
POST   /api/user/mood-history   → Save mood session
GET    /api/user/mood-history   → Get mood history
GET    /api/user/mood-stats     → Get mood analytics
POST   /api/user/favorites      → Add favorite song
DELETE /api/user/favorites/:id  → Remove favorite
GET    /api/user/favorites      → Get all favorites
```

---

## ✅ Component Status

### Frontend Components

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| **App** | `App.jsx` | ✅ Complete | Main app, lazy loads MoodWebcam |
| **Login** | `Login.jsx` | ✅ Complete | 📧 Email-based authentication with demo accounts |
| **MoodWebcam** | `MoodWebcam.jsx` | ✅ Complete | 🤖 Face detection with face-api.js |
| **ProfileNav** | `ProfileNav.jsx` | ✅ Complete | 👤 User profile panel with editable name and gender, email verification flow, theme toggle, login history, logout and delete account actions |
| **DemoGuide** | `DemoGuide.jsx` | ✅ Complete | 🎭 Demo mode selector |
| **Loader** | `Loader.jsx` | ✅ Complete | ⏳ Intro animation |
| **HomeTab** | `HomeTab.jsx` | ✅ Complete | 🎵 Basic mood selector |
| **HistoryTab** | `HistoryTab.jsx` | ✅ Complete | 📊 Mood history display |
| **FavoritesTab** | `FavoritesTab.jsx` | ✅ Complete | ❤️ Favorites list |

### Backend Services

| Service | File | Status | Notes |
|---------|------|--------|-------|
| **Database** | `db.js` | ✅ Complete | 🗄️ MongoDB connection via Mongoose |
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
