# 🎵 Music Mood Matcher

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![GitHub](https://img.shields.io/badge/GitHub-Music--Mood--Matcher-black?logo=github)](https://github.com/KGFCH2/Music-Mood-Matcher)

A modern React web app that helps users discover songs based on their mood. Features AI-powered face detection, user authentication with email verification, and 240+ songs across multiple languages.

---

## ⚡ Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎵 **240+ Songs** | Multi-language curated collection (English, Hindi, Bengali) |
| 🎭 **6 Mood Categories** | Happy, Sad, Energetic, Romantic, Chill, Angry |
| 🤖 **AI Face Detection** | Mood Webcam with face-api.js for automatic mood recognition |
| 💕 **Crush Mode** | Fun quiz to generate playlists for your crush |
| 👤 **User Authentication** | Register/Sign-In with email verification via EmailJS |
| ⭐ **Favorites & History** | Per-user saved favorites and mood tracking |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🎨 **Beautiful UI** | Framer Motion animations, glass-morphism design |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                    # Main app (~450 lines)
│   ├── App.css                    # Core styles (~1113 lines)
│   ├── components/
│   │   ├── Login.jsx              # Auth with verification (~1230 lines)
│   │   ├── ProfileNav.jsx         # User profile panel (~1139 lines)
│   │   ├── MoodWebcam.jsx         # AI face detection (~130 lines)
│   │   ├── CrushMode.jsx          # Crush quiz (~120 lines)
│   │   ├── DemoGuide.jsx          # Demo users (~240 lines)
│   │   ├── Loader.jsx             # Intro animation (~356 lines)
│   │   └── tabs/
│   │       ├── HomeTab.jsx
│   │       ├── FavoritesTab.jsx
│   │       └── HistoryTab.jsx
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state management
│   └── data/
│       └── songs.js               # Song database (240+ songs)
├── public/
│   └── models/                    # Face-api.js AI models
├── package.json
├── vite.config.js
└── .env.example
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.1 + Vite 7.1.7
- Framer Motion 12.23.24 (animations)
- @emailjs/browser 4.4.1 (email service)
- face-api.js 0.22.2 (AI face detection)
- react-webcam 7.2.0 (webcam access)

**Development:**
- ESLint 9.36.0
- PropTypes 15.8.1

---

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview build locally
npm run lint     # Check code quality
```

---

## 🔐 Authentication

### Register
1. Enter name & email with real-time validation ✓/✗
2. Verification code sent via EmailJS
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
