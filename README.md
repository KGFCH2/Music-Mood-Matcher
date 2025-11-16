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
├── README.md                      ← You are here
└── frontend/                      ← Main React application
    ├── src/
    │   ├── App.jsx               ← Main React component (356 lines)
    │   ├── App.css               ← All styling and animations
    │   ├── index.css             ← Global styles
    │   ├── main.jsx              ← Entry point
    │   ├── assets/               ← Static assets
    │   └── data/
    │       └── songs.js          ← Song database (277 lines, 240+ songs)
    ├── public/                   ← Static files
    ├── package.json              ← Dependencies and scripts
    ├── vite.config.js            ← Vite configuration
    ├── index.html                ← HTML template
    └── eslint.config.js          ← ESLint configuration
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
- ![Favorites](https://img.shields.io/badge/Favorites%20System-Enabled-blue) **Favorites System** - Save and manage your favorite songs with localStorage
- ![History](https://img.shields.io/badge/History%20Tracking-Active-informational) **Mood History** - Track your mood selections over time
- ![YouTube](https://img.shields.io/badge/YouTube-Integrated-red?logo=youtube) **YouTube Integration** - Click any song to open on YouTube
- ![Animations](https://img.shields.io/badge/Animations-Framer%20Motion-purple) **Beautiful UI** - Modern design with Framer Motion animations
- ![Responsive](https://img.shields.io/badge/Responsive-Mobile%20Ready-brightgreen) **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ![Filter](https://img.shields.io/badge/Filters-By%20Language-orange) **Language Filter** - Filter songs by language preference

---

- ![Loader](https://img.shields.io/badge/Loader-Animated%20Intro-lightgrey) **Loader Page** - A short animated loader appears before the homepage (visual-only by default)

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

1. **Favorites** - Key: `musicMoodFavorites`
   - JSON array of favorite songs with IDs

2. **History** - Key: `musicMoodHistory`
   - Array of mood selections with timestamps

Data persists across browser sessions automatically.

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

| File | Purpose | Size |
|------|---------|------|
| `App.jsx` | Main React component with logic | 356 lines |
| `App.css` | All styling and animations | ~400 lines |
| `songs.js` | Song database for all moods | 277 lines |
| `index.css` | Global styles | ~50 lines |
| `main.jsx` | React app entry point | ~10 lines |
| `vite.config.js` | Vite build configuration | ~20 lines |

---

## 🎯 How It Works

1. **User selects a mood** → App filters songs for that mood
2. **User selects language** → Songs are further filtered by language
3. **User clicks a song** → Opens YouTube in new tab
4. **User marks as favorite** → Song saved to localStorage
5. **User checks history** → Views past mood selections

---

## 📱 Browser Support

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

![Code Size](https://img.shields.io/badge/Code%20Size-~1100%20Lines-blue?style=flat-square)
![Build Size](https://img.shields.io/badge/Build%20Size-~70%20KB-green?style=flat-square)
![Performance](https://img.shields.io/badge/Performance-95%2B%20Lighthouse-brightgreen?style=flat-square)
![Dev Server](https://img.shields.io/badge/Dev%20Server-%3C2s-informational?style=flat-square)

---

## 🛠 Recent updates

- **2025-11-15** — Inserted a new animated loader page shown before the homepage. The loader is visual-only by default (no autoplaying music). Files added/updated: `frontend/src/components/Loader.jsx`, `frontend/src/components/loader.css`. Audio experiments were performed earlier and then removed per request.

Last Updated: November 15, 2025
