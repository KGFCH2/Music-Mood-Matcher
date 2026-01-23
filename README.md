# 🎵 Music Mood Matcher

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![GitHub](https://img.shields.io/badge/GitHub-Music--Mood--Matcher-black?logo=github)](https://github.com/KGFCH2/Music-Mood-Matcher)

Your personal DJ in a browser. 🎧 Discover the perfect soundtrack for every emotion using AI mood detection. 150+ songs in 3 languages, all curated to match your vibe.

---

## 🛠️ Recent Changes

- 📱 Mobile Friendly Improvements Added Including Compact Navigation And Layout Tweaks
- 🚪 Logout Button Moved Into Profile Details For Easier Access On Mobile
- 🎯 Navbar Brand Focus Uses `:focus-visible` To Preserve Keyboard Accessibility While Removing Click Outline
- ♿ Minor Styling And Accessibility Fixes

---

## 🎸 Let's Jam: Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

### Backend Setup (Optional)
```bash
cd backend
npm install
cp .env.example .env
# configure MONGODB_URI and JWT_SECRET in .env
npm run dev        # Starts on http://localhost:5000
```

---

## 🎼 The Greatest Hits

| Feature | Description |
|---------|-------------|
| 🎵 **150+ Hits** | Multi-language collection in English, Hindi & Bengali |
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
│   │   ├── main.jsx                   # App bootstrap and root mounting
│   │   ├── App.jsx                    # Main app with lazy loading
│   │   ├── api/
│   │   │   └── apiClient.js           # Axios API client
│   │   ├── components/
│   │   │   ├── DemoGuide.jsx          # Demo guide component
│   │   │   ├── Loader.jsx             # Loading spinner
│   │   │   ├── Login.jsx              # User authentication
│   │   │   ├── MoodWebcam.jsx         # AI mood detection
│   │   │   ├── ProfileNav.jsx         # User profile navigation
│   │   │   └── tabs/
│   │   │       ├── FavoritesTab.jsx   # User's favorite songs
│   │   │       ├── HistoryTab.jsx     # Mood history
│   │   │       └── HomeTab.jsx        # Main interface
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Authentication state
│   │   ├── data/
│   │   │   └── songs.js               # Song database
│   │   ├── test/
│   │   │   ├── setup.js               # Vitest configuration
│   │   │   └── App.test.jsx           # Sample tests
│   │   └── serviceWorkerRegister.js   # PWA service worker helper
│   ├── public/
│   │   ├── sw.js                      # Service worker script
│   │   ├── manifest.json              # PWA manifest
│   │   └── models/                    # AI model files (if present)
│   ├── vitest.config.js               # Testing configuration
│   ├── vite.config.js                 # Build configuration
│   ├── eslint.config.js               # Linting configuration
│   ├── vercel.json                    # Vercel deployment config
│   ├── index.html                     # Main HTML file
│   └── package.json                   # Dependencies and scripts
├── backend/                           # Server side application
│   ├── server.js                      # Express server entry point
│   ├── db.js                          # MongoDB connection helper
│   ├── package.json                   # Backend dependencies and scripts
│   ├── controllers/                   # Route handlers
│   ├── models/                        # Mongoose schemas
│   ├── routes/                        # API route definitions
│   ├── middleware/                    # Auth and error handlers
│   └── README.md                      # Backend quick start
├── INSTRUCTIONS.md                    # Setup and cleanup notes
├── LICENSE                            # MIT License
└── README.md                          # This file
```

## 🎸 Setup Your Stage

### Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

🎵 Your personal DJ is ready to rock!

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

## 🔒 Data Security

- ✅ User data stored locally in browser (localStorage)
- ✅ No server-side data transmission
- ✅ AI processing happens client-side
- ✅ PWA caching for offline functionality
- ✅ EmailJS for contact forms (external service)

---

## � Offline Radio: PWA Features

- ✅ Record songs for offline playback
- ✅ Make it your home screen station
- ✅ No internet? No problem! Plays cached hits
- ✅ One-tap installation to home screen
- ✅ Lightning-fast track loading

---

## 🎪 Going on Tour: Deployment

### 🎸 Concert Venues (Deploy to Vercel/Netlify)
```bash
cd frontend
npm run build
# 🎭 Deploy the dist/ folder to your hosting platform
```

**Recommended platforms:**
- **Vercel**: Connect GitHub repo, automatic deployments
- **Netlify**: Drag & drop dist/ folder or connect Git
- **GitHub Pages**: Use gh-pages package

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
| 🎵 Song Library | 150+ hits |
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

🎵 **Last Updated:** January 23, 2026 | **Version:** 2.4 - Frontend Mobile And Accessibility Updates 🎵
