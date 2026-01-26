# 🎵 Music Mood Matcher

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet?logo=progressive-web-apps&logoColor=white)](https://web.dev/progressive-web-apps/)

Your personal AI-powered DJ in a browser. 🎧 Music Mood Matcher uses cutting-edge face detection to understand your emotions and curate the perfect soundtrack. With over 150+ songs across multiple languages and a robust full-stack architecture, it's designed to be your ultimate emotional musical companion.

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Mood Detection** | Real-time facial expression analysis using `face-api.js` to detect 6 core emotions. |
| 🎵 **Curated Library** | 150+ hand-picked tracks in **English, Hindi, and Bengali**. |
| 📱 **Cross-Platform PWA** | Installable on mobile and desktop with offline support and caching. |
| 🔒 **Secure Auth** | Full-stack authentication with JWT, bcrypt hashing, and secure session management. |
| 📊 **Emotional Insights** | Visualized mood history and analytics to track your musical journey. |
| 🎨 **Immersive UI** | Aurora text effects, glass-morphism, and smooth Framer Motion animations. |
| 📧 **Password Recovery** | Integrated EmailJS support for secure verification code-based resets. |
| 🌙 **Theme Control** | Multi-theme support with dark/light modes and personalized profile management. |

---

## 🛠️ Performance & Tech Stack

- **⚛️ Frontend:** React 18, Vite 7, Framer Motion, Axios, React Icons.
- **🟢 Backend:** Node.js, Express, MongoDB (Mongoose), JWT.
- **🧠 AI/ML:** Face-api.js (TensorFlow.js based) for on-device facial recognition.
- **📶 PWA:** Service Workers, Web Manifest, Offline Caching strategies.
- **🧪 Tools:** ESLint for linting, Vitest for unit testing.

---

## 🎸 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- NPM or Yarn

### ⚙️ Quick Installation

1. **Clone & Install Frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend:**
   ```bash
   cd ../backend
   npm install
   ```

3. **Environment Setup:**
   *   Create `.env` in `frontend/` with `VITE_API_URL`, `VITE_EMAILJS_SERVICE_ID`, etc.
   *   Create `.env` in `backend/` with `MONGO_URI` and `JWT_SECRET`.

4. **Launch Application:**
   *   Backend: `cd backend && npm start` (Runs on port 5000)
   *   Frontend: `cd frontend && npm run dev` (Runs on port 5173)

---

---

## 📁 Project Architecture

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

## ✨ Design Philosophy

Music Mood Matcher isn't just an app; it's an experience. We've utilized **🌈 Aurora gradients** and **🪟 glass-morphism** to create a focused, distraction-free environment that adapts to your mood. The UI shifts subtly as you move through different emotional states, reinforcing the connection between your feelings and the music.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Contributors

- **Babin Bid** - *Founder & Lead Developer*
- **Debasmita Bose** - *Lead Designer & UI Specialist*

---

*Made with ❤️ for music lovers everywhere.*






## 📻 Offline Radio: PWA Features

- ✅ Record songs for offline playback
- ✅ Make it your home screen station
- ✅ 📶 No internet? No problem! Plays cached hits
- ✅ 📲 One-tap installation to home screen
- ✅ ⚡ Lightning-fast track loading

---



## ⏭️ Encore: Coming Soon

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

🎵 **Last Updated:** January 26, 2026 | **Version:** 3.0 - Full-Stack AI Integration 🎵
