# 🎵 Music Mood Matcher

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-Personal%20Use-blue)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![GitHub](https://img.shields.io/badge/GitHub-Music--Mood--Matcher-black?logo=github)](https://github.com/KGFCH2/Music-Mood-Matcher)

A React-based web application that helps users find songs based on their current mood. Built with modern web technologies, featuring a beautiful UI with animations and support for multiple languages.

---

## 📁 Project Structure

```
Music Mood Matcher/
├── README.md                      ← Project documentation
├── LICENSE                        ← MIT License
└── frontend/                      ← Main React application
    ├── src/
    │   ├── App.jsx               ← Main React component (416 lines)
    │   ├── App.css               ← Main styles with mood themes & animations (~1113 lines)
    │   ├── index.css             ← Global styles (~50 lines)
    │   ├── main.jsx              ← React entry point (~10 lines)
    │   ├── assets/               ← Static assets
    │   ├── components/
    │   │   ├── Login.jsx         ← Register/Sign-In component (~1000 lines)
    │   │   ├── login.css         ← Auth forms styling (~550 lines)
    │   │   ├── Loader.jsx        ← Animated intro loader (356 lines)
    │   │   └── loader.css        ← Loader animations (~250 lines)
    │   ├── context/
    │   │   └── AuthContext.jsx   ← Auth state & useAuth hook (~50 lines)
    │   └── data/
    │       └── songs.js          ← Song database (277 lines, 240+ songs)
    ├── public/                   ← Static files
    ├── index.html                ← HTML template
    ├── package.json              ← Dependencies and scripts
    ├── vite.config.js            ← Vite configuration
    ├── eslint.config.js          ← ESLint rules
    └── .gitignore                ← Git ignore file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:5173**

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## ✨ Features

- ![Songs](https://img.shields.io/badge/240%2B-Songs-brightgreen) **240+ Songs** - Curated collection across multiple languages
- ![Moods](https://img.shields.io/badge/6-Moods-blueviolet) **6 Mood Categories** - Happy, Sad, Energetic, Romantic, Chill, Angry
- ![Languages](https://img.shields.io/badge/3-Languages-yellow) **Multi-Language Support** - English, Hindi, Bengali
- ![Authentication](https://img.shields.io/badge/Authentication-User%20System-blue) **User Authentication** - Register/Sign-In system with email verification
- ![User Data](https://img.shields.io/badge/User%20Data-Isolated-informational) **User-Specific Data** - Each user has isolated favorites and history
- ![Favorites](https://img.shields.io/badge/Favorites%20System-Enabled-blue) **Favorites System** - Save and manage your favorite songs per user
- ![History](https://img.shields.io/badge/History%20Tracking-Active-informational) **Mood History** - Track your mood selections over time (user-specific)
- ![Email](https://img.shields.io/badge/Email%20Verification-Active-brightgreen) **Email Verification** - Verification code sent on registration via EmailJS
- ![YouTube](https://img.shields.io/badge/YouTube-Integrated-red?logo=youtube) **YouTube Integration** - Click any song to open on YouTube
- ![Animations](https://img.shields.io/badge/Animations-Framer%20Motion-purple) **Beautiful UI** - Modern design with Framer Motion animations
- ![Responsive](https://img.shields.io/badge/Responsive-Mobile%20Ready-brightgreen) **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ![Filter](https://img.shields.io/badge/Filters-By%20Language-orange) **Language Filter** - Filter songs by language preference
- ![Loader](https://img.shields.io/badge/Loader-Animated%20Intro-lightgrey) **Loader Page** - Animated intro loader before main app
- ![Session](https://img.shields.io/badge/Session-Security-brightgreen) **Session Security** - Auto-logout on server restart, must re-login

### 🆕 New Polished Features (v2.0)

- ![Real-time](https://img.shields.io/badge/Validation-Real--time-green) **Real-time Input Validation** - Instant feedback with ✓/✗ indicators as you type
- ![Auto Submit](https://img.shields.io/badge/Auto-Submit-blue) **Auto-Submit Verification** - Code auto-submits when 6 characters entered
- ![Cooldown](https://img.shields.io/badge/Resend-Cooldown-orange) **60s Resend Cooldown** - Rate limiting prevents email spam
- ![Auto Focus](https://img.shields.io/badge/UX-Auto%20Focus-purple) **Auto-Focus** - Verification input auto-focuses when dialog opens
- ![Success Animation](https://img.shields.io/badge/Animation-Success-brightgreen) **Success Animation** - Celebratory animation on successful verification
- ![Accessibility](https://img.shields.io/badge/A11y-ARIA%20Labels-blue) **Enhanced Accessibility** - ARIA labels, roles, and keyboard navigation
- ![Env Variables](https://img.shields.io/badge/Config-Environment%20Variables-yellow) **Environment Variables** - EmailJS credentials via `.env` file

## 📊 Data Overview

### Songs Database (`frontend/src/data/songs.js`)

- ![Total Songs](https://img.shields.io/badge/Total%20Songs-240%2B-brightgreen?style=flat) **Total Songs**: 240+
- ![Languages](https://img.shields.io/badge/Languages-3-yellow?style=flat) **Languages**: 3 (English, Hindi, Bengali)
- ![Moods](https://img.shields.io/badge/Moods-6-blueviolet?style=flat) **Moods**: 6 categories
- ![Per Mood](https://img.shields.io/badge/Per%20Mood-30--40-orange?style=flat) **Songs per Mood**: 30-40 per language
- ![Format](https://img.shields.io/badge/Format-JavaScript%20Object-informational?style=flat) **Data Format**: JavaScript object with mood-based organization

Each song includes:
- Title
- Artist
- Language
- YouTube URL

---

## 🛠️ Tech Stack

### Frontend Dependencies
- ![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white&style=flat) **React** (^19.1.1) - UI library
- ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.24-purple?logo=framer&logoColor=white&style=flat) **Framer Motion** (^12.23.24) - Animation library
- ![React DOM](https://img.shields.io/badge/React%20DOM-19.1.1-blue?logo=react&logoColor=white&style=flat) **React DOM** (^19.1.1) - DOM rendering
- ![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white&style=flat) **Vite** (^7.1.7) - Build tool and dev server
- ![PropTypes](https://img.shields.io/badge/PropTypes-15.8.1-green?style=flat) **PropTypes** (^15.8.1) - Runtime type checking

### Dev Dependencies
- ![ESLint](https://img.shields.io/badge/ESLint-9.36.0-4b3ddb?logo=eslint&logoColor=white&style=flat) **ESLint** (^9.36.0) - Code linting
- ![Node](https://img.shields.io/badge/Node.js-v16%2B-green?logo=node.js&logoColor=white&style=flat) **React plugin for ESLint**
- ![Testing](https://img.shields.io/badge/Testing-Ready-brightgreen?style=flat) **React DevTools support**

---

## 🎨 Customization

### Adding New Songs

Edit `frontend/src/data/songs.js`:

```javascript
happy: [
  {
    title: 'Your Song Title',
    artist: 'Artist Name',
    language: 'English', // or 'Hindi' or 'Bengali'
    url: 'https://www.youtube.com/watch?v=...'
  },
  // ... more songs
]
```

### Changing Colors/Styles

Edit `frontend/src/App.css` to modify:
- Color schemes
- Animations
- Responsive breakpoints
- Button and component styling

### Modifying UI Components

Edit `frontend/src/App.jsx` to:
- Change mood options
- Modify navigation tabs (Home, Favorites, History, About)
- Adjust layout and styling logic

---

## 💾 Data Persistence

The app uses browser's **localStorage** to save:

1. **User Accounts** - Key: `musicMoodUsers`
   - JSON array of registered users with emails, names, verification codes, and login history

2. **Current Session** - Key: `musicMoodUser`
   - Automatically cleared on server restart (requires re-login)

3. **User Favorites** - Key: `musicMoodFavorites-{userId}`
   - JSON array of favorite songs with IDs (per user)

4. **User History** - Key: `musicMoodHistory-{userId}`
   - Array of mood selections with timestamps (per user)

Data persists across browser sessions automatically. Each user has completely isolated data.

---

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# Output directory: frontend/dist/

# Preview build locally
npm run preview
```

The `dist/` folder contains production-ready files ready for deployment.

---

## 🌐 Deployment Options

### Vercel (Recommended)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel&logoColor=white)
```bash
npm i -g vercel
cd frontend
vercel deploy
```

### Netlify
![Netlify](https://img.shields.io/badge/Netlify-Deploy-00c7b7?logo=netlify&logoColor=white)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Static Hosting
![Static](https://img.shields.io/badge/Static%20Hosting-Available-blue)
- Build the project: `npm run build`
- Upload `dist/` folder to any static hosting service

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Dev server won't start | Delete `node_modules`, run `npm install` again |
| Port 5173 already in use | Run `npm run dev -- --port 3000` |
| Songs not loading | Check browser console (F12) for errors |
| Favorites not saving | Check if localStorage is enabled in browser |
| Build errors | Run `npm run lint` to check for issues |

---

## 📝 File Descriptions

| File | Purpose | Size | Type |
|------|---------|------|------|
| `App.jsx` | Main React component with mood selection, favorites, and history logic | 416 lines | Component |
| `Login.jsx` | Register/Sign-In with real-time validation, auto-submit, cooldown timer | ~1000 lines | Component |
| `Loader.jsx` | Animated intro loader page | 356 lines | Component |
| `AuthContext.jsx` | Authentication state management with useAuth hook | ~50 lines | Context |
| `App.css` | All styling and animations (moods, cards, navbar, emoji separation) | ~1113 lines | Styles |
| `login.css` | Auth forms styling with validation states, animations, accessibility | ~550 lines | Styles |
| `loader.css` | Loader animation styles | ~250 lines | Styles |
| `songs.js` | Song database for all moods and languages | 277 lines | Data |
| `index.css` | Global styles | ~50 lines | Styles |
| `main.jsx` | React app entry point with AuthProvider | ~10 lines | Entry |

---

## 🎯 How It Works

1. **User selects a mood** → App filters songs for that mood
2. **User selects language** → Songs are further filtered by language
3. **User clicks a song** → Opens YouTube in new tab
4. **User marks as favorite** → Song saved to localStorage
5. **User checks history** → Views past mood selections

---

## 🔐 Authentication System

### User Registration
1. User enters **Name** and **Email** with real-time validation
2. Visual feedback: ✓ for valid input, ✗ for invalid
3. Verification code generated and sent via EmailJS
4. Verification dialog auto-focuses the code input
5. Code auto-submits when 6 characters entered
6. Success animation plays on verification
7. Auto-redirects to Home page

### User Sign-In
1. User enters registered **Email**
2. System validates email against registered users
3. If unverified, sends new verification code
4. User session restored with their favorites and history
5. Auto-redirects to Home page

### Email Verification Features
- **60-second cooldown** between resend requests (prevents spam)
- **Auto-submit** when verification code is complete
- **Auto-focus** on verification input field
- **Success animation** with checkmark on verification
- **Error shake animation** for invalid codes

### Session Security
- Session data (`musicMoodUser`) is cleared on server restart
- Users must re-login when accessing the app (no auto-login)
- User accounts and history remain saved in localStorage
- Each user's data is completely isolated by userId

### Environment Variables
Create a `.env` file in the `frontend/` directory:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```
See `.env.example` for reference.

---

![Chrome](https://img.shields.io/badge/Chrome-Latest-green?logo=google-chrome&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-Latest-orange?logo=firefox&logoColor=white)
![Safari](https://img.shields.io/badge/Safari-Latest-blue?logo=safari&logoColor=white)
![Edge](https://img.shields.io/badge/Edge-Latest-blue?logo=microsoft-edge&logoColor=white)
![Mobile](https://img.shields.io/badge/Mobile-iOS%20%26%20Android-brightgreen?logo=apple&logoColor=white)

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔧 Development Tips

- **Hot Module Replacement**: Changes in `src/` files auto-reload without losing state
- **DevTools**: Press F12 to open developer tools
- **LocalStorage Debug**: Application → Local Storage to inspect saved data
- **Mobile Testing**: DevTools → Toggle Device Toolbar (Ctrl+Shift+M)

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 📄 License

This project is provided as-is for educational and personal use.

---

## 🎵 Getting Started

1. **Install dependencies**: `npm install`
2. **Run dev server**: `npm run dev`
3. **Explore the app**: Try different moods and filters
4. **Customize**: Edit songs and styles as needed
5. **Deploy**: Build and deploy to your platform

**Enjoy finding your perfect mood-based songs! 🎧✨**

---

## 📈 Quick Stats

![Code Size](https://img.shields.io/badge/Code%20Size-~2500%20Lines-blue?style=flat-square)
![Components](https://img.shields.io/badge/Components-4-purple?style=flat-square)
![Build Size](https://img.shields.io/badge/Build%20Size-~70%20KB-green?style=flat-square)
![Build Time](https://img.shields.io/badge/Build%20Time-2.7s-informational?style=flat-square)
![Modules](https://img.shields.io/badge/Modules-432-orange?style=flat-square)

---

## 🛠 Recent Updates

- **2025-11-28** — Login System Polish & Enhancements (v2.0)
  - ✨ **Real-time Input Validation** - Live ✓/✗ feedback as users type names and emails
  - ⏱️ **60-second Resend Cooldown** - Rate limiting with countdown timer to prevent email spam
  - 🎯 **Auto-Focus** - Verification code input automatically focuses when dialog opens
  - ⚡ **Auto-Submit** - Verification code auto-submits when 6 characters are entered
  - 🎉 **Success Animation** - Celebratory green overlay with checkmark animation on verification
  - ♿ **Accessibility Improvements** - Added ARIA labels, roles, aria-live regions for screen readers
  - 🔐 **Environment Variables** - EmailJS credentials can now be stored in `.env` file
  - 📝 **Input Sanitization** - Verification codes sanitized to uppercase alphanumeric only
  - 🎨 **New CSS Styles** - Validation states, success animations, focus-visible outlines
  - Files updated: `Login.jsx`, `login.css`, `.env.example` created

- **2025-11-18** — UI Polish: Emoji/Text Separation
  - Separated emojis from mood-specific text colors throughout all sections
  - Updated `.mood-title` to use flexbox layout with `.mood-emoji-header` and `.mood-text` spans
  - Applied mood-specific color gradients only to `.mood-text` spans (not emojis)
  - Ensured emojis display in natural emoji colors, completely independent from text coloring
  - Consistent emoji separation applied to: Home mood titles, Favorites tab, History tab, About tab
  - Files updated: `frontend/src/App.css` (mood title styling and all 6 mood color rules)
  - Build optimized: 2.69s build time, 432 modules

- **2025-11-17** — Login Optimization & Authentication:
  - Optimized login form to fit properly on screen (reduced padding, margins, heights)
  - Major authentication overhaul with Register/Sign-In dual system and sliding transitions
  - Added email verification on registration (code logged to console)
  - User-specific favorites and history storage (isolated by userId)
  - Auto-redirect to Home on login/user switch
  - Session security: Auto-logout on server restart
  - Cleaned up background: removed circles and frequency bars, kept only floating music icons
  - Files added/updated: `frontend/src/components/Login.jsx`, `frontend/src/components/login.css`, `frontend/src/context/AuthContext.jsx`, `frontend/src/App.jsx`, `frontend/src/App.css`

- **2025-11-15** — Inserted a new animated loader page shown before the homepage. The loader is visual-only by default (no autoplaying music). Files added/updated: `frontend/src/components/Loader.jsx`, `frontend/src/components/loader.css`. Audio experiments were performed earlier and then removed per request.

Last Updated: November 28, 2025
