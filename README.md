# 🎵 Music Mood Matcher

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

- **6 Mood Categories**: Happy, Sad, Energetic, Romantic, Chill, Angry
- **240+ Songs**: Curated collection across multiple languages
- **Multi-Language Support**: English, Hindi, Bengali
- **Favorites System**: Save and manage your favorite songs with localStorage
- **Mood History**: Track your mood selections over time
- **YouTube Integration**: Click any song to open on YouTube
- **Beautiful UI**: Modern design with Framer Motion animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Language Filter**: Filter songs by language preference

---

## 📊 Data Overview

### Songs Database (`frontend/src/data/songs.js`)

- **Total Songs**: 240+
- **Languages**: 3 (English, Hindi, Bengali)
- **Moods**: 6 categories
- **Songs per Mood**: 30-40 per language
- **Data Format**: JavaScript object with mood-based organization

Each song includes:
- Title
- Artist
- Language
- YouTube URL

---

## 🛠️ Tech Stack

### Frontend Dependencies
- **React** (^19.1.1) - UI library
- **Framer Motion** (^12.23.24) - Animation library
- **React DOM** (^19.1.1) - DOM rendering
- **Vite** (^7.1.7) - Build tool and dev server

### Dev Dependencies
- ESLint (^9.36.0) - Code linting
- React plugin for ESLint
- React DevTools support

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
```bash
npm i -g vercel
cd frontend
vercel deploy
```

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Static Hosting
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

Last Updated: November 8, 2025
