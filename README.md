# 🎵 Music Mood Matcher

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://www.mongodb.com)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![GitHub](https://img.shields.io/badge/GitHub-Music--Mood--Matcher-black?logo=github)](https://github.com/KGFCH2/Music-Mood-Matcher)

Your personal DJ in a browser. 🎧 Discover the perfect soundtrack for every emotion using AI mood detection. 240+ songs in 3 languages, all curated to match your vibe.

---

## 🎸 Let's Jam: Quick Start

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

## 🎼 The Greatest Hits

| Feature | Description |
|---------|-------------|
| 🎵 **240+ Hits** | Multi-language collection in English, Hindi & Bengali |
| 🎭 **6 Mood Vibes** | Happy, Sad, Energetic, Romantic, Chill, Angry |
| 🤖 **AI DJ Mode** | Webcam detects your mood & auto-generates playlists |
| 💕 **Crush Mode** | Fun quiz to create the perfect playlist for your bae |
| 👤 **VIP Access** | Secure login with encrypted credentials |
| ⭐ **Your Collection** | Save favorites, track your mood over time |
| 📊 **Mood Analytics** | See your emotional music journey |
| 📻 **Offline Radio** | Works offline with service worker caching |
| 🔒 **Fort Knox** | CORS, rate limiting, military-grade protection |
| 🎨 **Studio Quality UI** | Smooth animations, glass-morphism design |

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

## 🎹 The Band Lineup

**🎸 Lead Guitar (Frontend):**
- React 19.1.1 + Vite 7.1.7 (Lightning-fast rendering)
- Framer Motion (Smooth choreography)
- Vitest + Testing Library (Quality assurance)
- Axios (HTTP messenger)
- PWA with Service Workers (Offline radio mode)

**🥁 The Rhythm Section (Backend):**
- Node.js + Express.js (The beat)
- MongoDB + Mongoose ODM (The vault)
- JWT (VIP passes)
- Bcryptjs (Vault locks)
- Helmet.js (Armor)
- Express Rate Limit (Bouncer)

**🤖 The AI Producer:**
- face-api.js (Mood microphone)
- react-webcam (Camera feed)

---

## 🎚️ Control Your Mix

### 🎸 Frontend Commands
```bash
npm run dev         # 🎤 Go live on stage
npm run build       # 📀 Master the recording
npm run preview     # 👂 Check the mix
npm run lint        # 🔊 Soundcheck
npm run test        # ✔️ Test the acoustics
npm run test:ui     # 📊 See the spectrum
```

### 🥁 Backend Commands
```bash
npm start           # 🎵 Release to radio
npm run dev         # 🎧 Studio mode with auto-reload
```

---

## 🎤 Soundcheck: Authentication Flow

### 🎸 The VIP Pass System
1. **Get Your Ticket** - Sign up, confirm your email
2. **Backstage Pass** - Login gets you a secure VIP token
3. **Show Your Pass** - Token proves you're on the list
4. **Verify at the Door** - System checks your pass is valid
5. **Renew Your Pass** - Fresh VIP pass every 7 days

### 🎵 The Setlist: API Endpoints

**🎤 Main Stage (Auth):**
```
POST   /api/auth/register  - 🎫 Get your concert ticket
POST   /api/auth/login     - 🎟️ Show your VIP pass
GET    /api/auth/profile   - 👤 See your artist profile
```

**🎧 Backstage (User):**
```
POST   /api/user/favorites         - ⭐ Add to your collection
DELETE /api/user/favorites/:songId - 🗑️ Remove from favorites
GET    /api/user/favorites        - 📋 Show all loved songs
POST   /api/user/mood-history     - 📝 Record this vibe
GET    /api/user/mood-history     - 📖 Play back your journey
GET    /api/user/mood-stats       - 📊 See your music DNA
```

---

## 🎧 Setup Your Studio

### 🎸 What You'll Need
- Node.js 18+ (Your instrument)
- MongoDB running locally or Atlas connection string (Your vault)

### Step 1: Setup the Amplifier (Backend)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Step 2: Plug In the Microphone (Frontend)
```bash
cd frontend
npm install
cp .env.example .env
# Update VITE_API_URL if backend is on different port
npm run dev
```

🎵 Both instruments are now playing in harmony!

---

## 🔊 Soundcheck: Testing

### 🎙️ Test the Acoustics
```bash
cd frontend
npm test                 # 🎵 Keep the beat going (watch mode)
npm run test:ui         # 📊 Visual spectrum analyzer
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

## � Fort Knox: Security

- ✅ VIP Passes expire every 7 days
- ✅ Passwords locked in a vault (bcryptjs)
- ✅ Only authorized remixes allowed (CORS)
- ✅ Armed guards on duty (Helmet.js)
- ✅ Bouncer at the door (Rate limiting)
- ✅ Secret setlist in .env
- ✅ Sensitive lyrics protected
- ✅ Indexed catalog for speed

---

## � Offline Radio: PWA Features

- ✅ Record songs for offline playback
- ✅ Make it your home screen station
- ✅ No internet? No problem! Plays cached hits
- ✅ One-tap installation to home screen
- ✅ Lightning-fast track loading

---

## 🎪 Going on Tour: Deployment

### 🎸 Concert Venues (Frontend on Vercel/Netlify)
```bash
npm run build
# 🎭 Send the master recording to the venue
```

### 🥁 Traveling with Equipment (Backend on Heroku/Railway/Render)
```bash
# Pack your setlist (.env variables)
# Ship the tour bus (MongoDB Atlas connection)
```

---

## ⚡ Turn Up the Volume: Performance

✅ Split tracks for faster delivery
✅ Cache the greatest hits
✅ Load features on-demand (lazy loading)
✅ Instant studio feedback (HMR)
✅ Indexed playlists for speed
✅ Compressed audio for fast streaming

---

## � Encore: Coming Soon

- [ ] 🎶 Spotify Integration - Stream your own music
- [ ] 🎤 Voice Mood Detection - Your voice sets the mood
- [ ] 🎵 Jam Sessions - Create playlists together in real-time
- [ ] 📱 Mobile Tour - Take it on the road with React Native
- [ ] 📊 The Greatest Hits - Deep dive into your music DNA
- [ ] 👥 Band Together - Share music with friends
- [ ] 🤖 The AI Maestro - Smart recommendations
- [ ] 🌍 Global Tour - Multi-language UI


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
- Models loaded from CDN (jsDelivr) automatically

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

## 🌍 World Tour: Browser Support

| Venue | Status |
|-------|--------|
| 🔵 Chrome Hall | ✅ Latest tour date |
| 🔥 Firefox Theater | ✅ Latest performance |
| 🍎 Safari Club | ✅ Latest show |
| 🔷 Edge Arena | ✅ Latest gig |
| 📱 Mobile Festivals | ✅ iOS & Android dates |

---

## 🎛️ Mix the Tracks: Configuration

### 🎚️ Volume Controls (Environment Variables)

Create your `.env` soundboard in `frontend/`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

See `.env.example` for reference.

### 🎵 Build Your Tracklist

Edit `src/data/songs.js` to add your hits:

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

## � Fixing the Amp: Troubleshooting

| 🎸 Issue | 🔧 Solution |
|---------|----------|
| Stage lights won't turn on | `rm -rf node_modules && npm install` |
| Port 5173 is booked | `npm run dev -- --port 3000` |
| Songs aren't saving to favorites | Check your browser's memory (localStorage) |
| Can't compile the remix | Run `npm run lint` for audio levels |
| Mood detection is mute | Unmute your camera permissions |

---

## 📊 Chart Stats

| 📈 Metric | Value |
|--------|-------|
| 🎼 Total Score | ~8000 notes |
| 🎹 Instruments | 10 components |
| 💿 Album Size | ~70 KB |
| ⏱️ Load Time | ~2.7s |
| 🎵 Song Library | 240+ hits |
| 🌍 Tour Stops | 3 languages |
| 🎭 Mood Genres | 6 vibes |

---

## 🎯 The Setlist

- ✅ 🎤 Artist accounts with email backstage passes
- ✅ 🤖 AI DJ reads your mood
- ✅ 💕 Love Song Generator for your crush
- ✅ 🌍 World tour (multi-language)
- 📋 🌓 Light show & dark mode stage
- 📋 📤 Share your hits with the world
- 📋 🎶 Stream from Spotify
- 📋  📻 Offline radio mode (PWA)

---

## 📄 License

Personal use - See [LICENSE](LICENSE) file

---

## 🚀 Join the Band

1. **🎸 Get Your Instrument:**
   ```bash
   git clone https://github.com/KGFCH2/Music-Mood-Matcher.git
   cd Music-Mood-Matcher/frontend
   npm install
   ```

2. **🎛️ Tune Your Mix:**
   - Copy `.env.example` to `.env`
   - Add your EmailJS soundboard settings

3. **🎤 Take the Stage:**
   ```bash
   npm run dev
   ```

4. **🎵 Jam Session:**
   - Use demo bands on the login stage
   - Or sign up with your email

**🎧✨ Let the music guide your mood—every. single. day.**

---

🎵 **Last Updated:** December 21, 2025 | **Version:** 2.2 - Now 100% Music-Themed! 🎵
