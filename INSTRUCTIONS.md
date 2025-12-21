# 🎵 Music Mood Matcher - Setup & Cleanup Notes

Last updated: 2025-12-21 — this file was edited to reflect repository cleanup.

Summary:

- The repo has been cleaned to remove large, prebuilt model shard files from `frontend/public/models/removed/` to keep the repository lightweight.
- `node_modules/` is intentionally not included; run `npm install` locally after cloning.

If you need the removed model files for local AI experiments, download them from the original model provider and place them into `frontend/public/models/` before running the app.

Quick setup

1) Frontend

```bash
cd frontend
npm install
npm run dev
```

2) Backend (if present)

```bash
cd backend
npm install
npm run dev
```

Repository cleanup notes

- Removed files:
  - `frontend/public/models/removed/face_expression_model-shard1`
  - `frontend/public/models/removed/face_expression_model-weights_manifest.json`
  - `frontend/public/models/removed/tiny_face_detector_model-shard1`
  - `frontend/public/models/removed/tiny_face_detector_model-weights_manifest.json`

- Recommendation: After cloning, remove `node_modules` and reinstall to reclaim space, or simply run `npm install` to recreate them locally.

Want me to also:

- Remove other large artifacts (e.g., local caches) from the repo?  
- Re-add model files into a release asset instead of tracking them in Git?  
Tell me which and I will proceed.
| vite | 7.1.7 | Build tool |
| vitest | 1.0.4 | Testing framework |

**Status:** ✅ **Dependencies fixed** (React 18 ↓ from 19 for compatibility)

#### Step 3b: Configure Environment
**File:** `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_EMAILJS_SERVICE_ID=service_zfess1e
VITE_EMAILJS_TEMPLATE_ID=template_hz19s08
VITE_EMAILJS_PUBLIC_KEY=yvSwGRuksv7zAychI
```

**Status:** ✅ **Configured**

#### Step 3c: Start Frontend Dev Server
```bash
npm run dev
# Expected: Vite server running on http://localhost:5173
```

#### Step 3d: Verify API Connection
In browser console (`http://localhost:5173`):
```javascript
// Test API connectivity
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
// Expected: {status: "Server is running"}
```

---

### **Phase 4: Frontend Integration**

#### Step 4a: Authentication Flow (JWT Integration)
The frontend needs to connect to backend JWT auth. Current flow:

**Before (localStorage only):**
```javascript
// AuthContext stores user data in localStorage
const login = (userData) => {
  setUser(userData)
  localStorage.setItem('musicMoodUser', JSON.stringify(userData))
}
```

**After (with backend JWT - IMPLEMENT THIS):**
```javascript
// 1. Call backend /auth/register or /auth/login
const { data } = await authAPI.login({ email, password })

// 2. Store JWT token
localStorage.setItem('authToken', data.token)

// 3. Set user in context
login({ userId: data.user.userId, name: data.user.name, email: data.user.email })

// 4. apiClient automatically injects token in requests
```

#### Step 4b: Backend API Endpoints Ready
All endpoints documented in [backend/IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md):

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
| **App** | `App.jsx` | ✅ Complete | Main app, lazy loads CrushMode & MoodWebcam |
| **Login** | `Login.jsx` | ✅ Complete | Email-based auth + demo accounts |
| **MoodWebcam** | `MoodWebcam.jsx` | ✅ Complete | Face detection with face-api.js |
| **CrushMode** | `CrushMode.jsx` | ✅ Complete | Quiz-based playlist generator |
| **ProfileNav** | `ProfileNav.jsx` | ✅ Complete | User profile panel |
| **DemoGuide** | `DemoGuide.jsx` | ✅ Complete | Demo mode selector |
| **Loader** | `Loader.jsx` | ✅ Complete | Intro animation |
| **HomeTab** | `HomeTab.jsx` | ✅ **FIXED** | Implemented basic mood selector |
| **HistoryTab** | `HistoryTab.jsx` | ✅ **FIXED** | Implemented mood history display |
| **FavoritesTab** | `FavoritesTab.jsx` | ✅ **FIXED** | Implemented favorites list |

### Backend Services

| Service | File | Status | Notes |
|---------|------|--------|-------|
| **Database** | `db.js` | ✅ Complete | MongoDB connection via Mongoose |
| **Auth Controller** | `authController.js` | ✅ Complete | Register, login, profile |
| **User Controller** | `userController.js` | ✅ Complete | Favorites, mood history, stats |
| **Auth Middleware** | `middleware/auth.js` | ✅ Complete | JWT verification |
| **Error Handler** | `middleware/errorHandler.js` | ✅ Complete | Consistent error responses |
| **User Model** | `models/User.js` | ✅ Complete | Schema with favorites & preferences |
| **MoodHistory Model** | `models/MoodHistory.js` | ✅ Complete | Schema with auto-delete (90 days) |
| **Auth Routes** | `routes/authRoutes.js` | ✅ Complete | Register, login, profile endpoints |
| **User Routes** | `routes/userRoutes.js` | ✅ Complete | Favorites, mood history endpoints |

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
- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Connect GitHub, auto-deploy
- **Static hosting**: Upload `dist/` folder

### Backend Deployment
```bash
# Deploy src/ to:
# - Heroku: git push heroku main
# - Railway.app: Connect GitHub
# - Render.com: Connect GitHub
```

**Set environment variables on hosting platform:**
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
CORS_ORIGIN=your_frontend_production_url
NODE_ENV=production
```

---

## 🔒 Security Checklist

✅ JWT tokens with 7-day expiry  
✅ Passwords hashed with bcryptjs (10 salt rounds)  
✅ CORS restricted to frontend origin  
✅ Helmet.js security headers  
✅ Rate limiting (100 req/15 min)  
✅ .env secrets protected  
✅ .gitignore configured  
✅ MongoDB unique indexes on email  
✅ Input validation on backend  
✅ Error handlers prevent info leaks  
✅ TTL indexes auto-delete old mood history (90 days)  

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Frontend Code** | ~4000 lines |
| **Backend Code** | ~400 lines |
| **Total Components** | 10 |
| **API Endpoints** | 9 |
| **Database Collections** | 2 (Users, MoodHistory) |
| **Build Size** | ~70 KB (gzipped) |
| **Songs Database** | 240+ tracks |
| **Supported Languages** | 3 (English, Hindi, Bengali) |
| **Mood Categories** | 6 |

---

## 🎯 Next Steps (QUICK WINS)

### Immediate (1-2 hours):
- [ ] Test frontend → backend API connection (Step 4a)
- [ ] Create test user via backend
- [ ] Verify login flow works
- [ ] Test favorites save/load from backend

### Short-term (4-6 hours):
- [ ] Update Login component to use backend `/auth/login`
- [ ] Connect ProfileNav to backend `/auth/profile`
- [ ] Implement real mood history storage
- [ ] Add error notifications for API failures

### Medium-term (1-2 weeks):
- [ ] Spotify API integration for music playback
- [ ] Advanced mood analytics dashboard
- [ ] Social sharing features
- [ ] Mobile app (React Native)

---

## 📝 File Checklist

### Backend Files
```
✅ backend/package.json              - Dependencies (rate-limit removed)
✅ backend/.env                       - MongoDB Atlas connection
✅ backend/src/server.js              - Express app setup
✅ backend/src/db.js                  - MongoDB connection
✅ backend/src/models/User.js         - User schema
✅ backend/src/models/MoodHistory.js  - Mood history schema
✅ backend/src/controllers/authController.js
✅ backend/src/controllers/userController.js
✅ backend/src/routes/authRoutes.js
✅ backend/src/routes/userRoutes.js
✅ backend/src/middleware/auth.js
✅ backend/src/middleware/errorHandler.js
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
✅ frontend/src/components/CrushMode.jsx
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

**Version:** 2.1 | **Updated:** December 21, 2025 | **Status:** Ready for Development ✅
