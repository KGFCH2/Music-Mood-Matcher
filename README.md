# 🎵 Music Mood Matcher

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://www.mongodb.com)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![GitHub](https://img.shields.io/badge/GitHub-Music--Mood--Matcher-black?logo=github)](https://github.com/KGFCH2/Music-Mood-Matcher)

A modern full-stack web app that helps users discover songs based on their mood. Features AI-powered face detection, JWT authentication with MongoDB, backend REST API, and 240+ songs across multiple languages.

---

## ⚡ Quick Start

### Backend Setup
```bash
cd backend
npm install
npm start          # or npm run dev for development
```
Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎵 **240+ Songs** | Multi-language curated collection (English, Hindi, Bengali) |
| 🎭 **6 Mood Categories** | Happy, Sad, Energetic, Romantic, Chill, Angry |
| 🤖 **AI Face Detection** | Mood Webcam with face-api.js for automatic mood recognition |
| 💕 **Crush Mode** | Fun quiz to generate playlists for your crush |
| 👤 **JWT Authentication** | Secure registration/login with password hashing |
| ⭐ **Favorites & History** | Per-user saved favorites and mood tracking with persistence |
| 📊 **Mood Analytics** | Track mood patterns over time |
| 📱 **PWA Support** | Works offline with service worker caching |
| 🔒 **Enhanced Security** | CORS, rate limiting, Helmet.js protection |
| 🎨 **Beautiful UI** | Framer Motion animations, glass-morphism design |

---

## 📁 Project Structure

```
Music-Mood-Matcher/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Main app with lazy loading
│   │   ├── api/
│   │   │   └── apiClient.js          # Axios API client
│   │   ├── components/
│   │   │   ├── CrushMode.jsx         # Lazy loaded
│   │   │   ├── MoodWebcam.jsx        # Lazy loaded
│   │   │   ├── ProfileNav.jsx        # User profile panel
│   │   │   └── tabs/
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state + JWT tokens
│   │   ├── test/
│   │   │   ├── setup.js              # Vitest configuration
│   │   │   └── App.test.jsx          # Sample tests
│   │   └── serviceWorkerRegister.js  # PWA service worker
│   ├── public/
│   │   ├── sw.js                     # Service worker script
│   │   └── manifest.json             # PWA manifest
│   ├── vitest.config.js              # Testing configuration
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express app setup
│   │   ├── db.js                     # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js               # User schema with favorites
│   │   │   └── MoodHistory.js        # Mood tracking schema
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, login, profile
│   │   │   └── userController.js     # Favorites, history, stats
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── userRoutes.js         # User endpoints
│   │   └── middleware/
│   │       ├── auth.js               # JWT verification
│   │       └── errorHandler.js       # Error handling
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.1 + Vite 7.1.7
- Framer Motion (animations)
- Vitest + Testing Library (unit tests)
- Axios (HTTP client)
- PWA with Service Workers

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose ODM
- JWT (authentication)
- Bcryptjs (password hashing)
- Helmet.js (security)
- Express Rate Limit (DDoS protection)

**AI/Detection:**
- face-api.js (facial expression recognition)
- react-webcam (camera access)

---

## 🚀 Available Scripts

### Frontend
```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run preview     # Preview build
npm run lint        # ESLint check
npm run test        # Run Vitest
npm run test:ui     # Vitest with UI
```

### Backend
```bash
npm start           # Production
npm run dev         # Development with nodemon
```

---

## 🔐 Authentication Flow

### JWT-based Auth (New)
1. **Register** - User creates account, password hashed with bcryptjs
2. **Login** - Returns JWT token stored in localStorage
3. **Request** - Token sent in Authorization header
4. **Verify** - Middleware validates token on protected routes
5. **Refresh** - Token expires in 7 days (configurable)

### API Endpoints

**Auth:**
```
POST   /api/auth/register  - Create new user
POST   /api/auth/login     - Get JWT token
GET    /api/auth/profile   - Get user profile (protected)
```

**User:**
```
POST   /api/user/favorites         - Add favorite song
DELETE /api/user/favorites/:songId - Remove favorite
GET    /api/user/favorites        - Get all favorites
POST   /api/user/mood-history     - Save mood session
GET    /api/user/mood-history     - Get mood history
GET    /api/user/mood-stats       - Get mood analytics
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or Atlas connection string

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update VITE_API_URL if backend is on different port
npm run dev
```

Both should now be running and communicating!

---

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm test                 # Watch mode
npm run test:ui         # With UI dashboard
```

### Example Test
```javascript
import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('should render correctly', () => {
    expect(true).toBe(true)
  })
})
```

---

## 🔒 Security Features

- ✅ JWT tokens (7-day expiry)
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ CORS enabled for frontend origin
- ✅ Helmet.js headers protection
- ✅ Rate limiting (100 requests/15 mins)
- ✅ .env variables for secrets
- ✅ .gitignore protects sensitive data
- ✅ MongoDB indexes for performance

---

## 📱 PWA Features

- ✅ Service worker caching strategy
- ✅ manifest.json for installation
- ✅ Works offline for cached assets
- ✅ Add to home screen on mobile
- ✅ Fast loading with code splitting

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables on hosting platform
# Deploy src folder with MongoDB Atlas connection
```

---

## 📊 Performance Optimizations

✅ Code splitting with React.lazy()  
✅ Service worker caching  
✅ Lazy-loaded components (CrushMode, MoodWebcam)  
✅ Vite fast refresh & HMR  
✅ MongoDB indexes for queries  
✅ Gzip compression via Express

---

## 🎯 Future Enhancements

- [ ] Spotify API integration for direct music playback
- [ ] Voice-based mood detection
- [ ] Real-time collaborative playlists
- [ ] Mobile app (React Native)
- [ ] Advanced mood analytics dashboard
- [ ] Social features (friend connections)
- [ ] Recommendation ML algorithm
- [ ] Multi-language UI support


3. Auto-focus and auto-submit verification code
4. Success animation on verification

### Sign-In
1. Enter registered email
2. System validates account
3. Session restored with favorites & history
4. Auto-redirect to Home

**Features:**
- ⏱️ 60-second resend cooldown (prevents spam)
- 🎯 Auto-focus on verification input
- ⚡ Auto-submit when code complete
- 🎉 Success animation on verification
- ♿ ARIA labels for accessibility

---

## 💾 Data Storage

All data stored in browser's **localStorage**:

| Key | Purpose | Scope |
|-----|---------|-------|
| `musicMoodUsers` | All registered user accounts | Global |
| `musicMoodUser` | Current session (cleared on restart) | Session |
| `musicMoodFavorites-{userId}` | Saved favorite songs | Per-user |
| `musicMoodHistory-{userId}` | Mood selections with timestamps | Per-user |

Each user has **completely isolated data**.

---

## 🤖 AI Features

### Mood Webcam
- Detects: Happy, Sad, Neutral, Surprised, Angry
- Auto-generates matching playlist
- Privacy-focused (no data sent to servers)

### Crush Mode
- Answer 4 fun questions
- AI maps answers to mood
- Creates personalized playlist

---

## 📦 Building & Deployment

```bash
npm run build    # Creates optimized dist/ folder
npm run preview  # Test production build locally
```

**Deploy to:**
- **Vercel** (recommended): `npm i -g vercel && vercel deploy`
- **Netlify**: Connect GitHub, set build dir to `dist`
- **Static hosting**: Upload `dist/` folder

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile | ✅ iOS & Android |

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in `frontend/`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

See `.env.example` for reference.

### Customize Songs

Edit `src/data/songs.js`:

```javascript
happy: [
  {
    title: 'Song Name',
    artist: 'Artist Name',
    language: 'English', // or 'Hindi', 'Bengali'
    url: 'https://www.youtube.com/watch?v=...'
  }
]
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Dev server won't start | `rm -rf node_modules && npm install` |
| Port 5173 in use | `npm run dev -- --port 3000` |
| Favorites not saving | Enable localStorage in browser |
| Build errors | Run `npm run lint` to check |
| Face detection not working | Check camera permissions |

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| Total Code | ~8000 lines |
| Components | 10 |
| Build Size | ~70 KB |
| Build Time | ~2.7s |
| Songs Database | 240+ tracks |
| Languages | 3 |
| Moods | 6 categories |

---

## 🎯 Roadmap

- ✅ User authentication with email verification
- ✅ AI mood detection via webcam
- ✅ Crush mode playlist generator
- ✅ Multi-language support
- 📋 Dark/Light theme toggle
- 📋 Social sharing
- 📋 Spotify integration
- 📋 Offline support (PWA)

---

## 📄 License

Personal use - See [LICENSE](LICENSE) file

---

## 🚀 Getting Started

1. **Clone & Install:**
   ```bash
   git clone https://github.com/KGFCH2/Music-Mood-Matcher.git
   cd Music-Mood-Matcher/frontend
   npm install
   ```

2. **Setup Environment:**
   - Copy `.env.example` to `.env`
   - Add your EmailJS credentials

3. **Run:**
   ```bash
   npm run dev
   ```

4. **Try Demo:**
   - Use demo accounts on login page
   - Or register with your email

**Enjoy finding your perfect mood-based songs! 🎧✨**

---

**Last Updated:** November 28, 2025 | **Version:** 2.1
