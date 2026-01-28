# 🎵 Music Mood Matcher Frontend

The immersive user interface for Music Mood Matcher. Built with React and Vite, this client-side application handles AI mood detection, PWA offline capabilities, and a responsive glass-morphic UI.

---

## 🚀 Key Technologies

- **Library:** React 18
- **Build Tool:** Vite 7
- **AI/ML:** `face-api.js` (TensorFlow.js) for on-device emotion detection
- **Animations:** Framer Motion
- **Icons:** React Icons
- **State:** React Context API (Auth & Theme)
- **Styling:** CSS3 with Glass-morphism & Aurora effects

---

## ⚙️ Quick Start

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configuration:**
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_EMAILJS_SERVICE_ID=your_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_key
   ```

3. **Development Mode:**
   ```bash
   npm run dev
   # App runs at http://localhost:5173
   ```

---

## 🤖 AI Integration

The app uses a webcam feed to analyze facial expressions. This process is:
- **Private:** Detection runs entirely in your browser; no images are sent to any server.
- **Fast:** Leverages GPU acceleration via TensorFlow.js.
- **Dynamic:** Automatically triggers playlist generation based on the highest-confidence emotion detected.

---

## 📶 PWA & Offline Support

- **Installable:** Add to Home Screen on mobile and desktop.
- **Offline Mode:** The Service Worker caches essential app assets and music metadata.
- **Fast Loading:** Instant startup on repeat visits using the "cache-first" strategy.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/          # Axios instance and API calls
│   ├── components/   # UI components and Tab views
│   ├── context/      # Authentication & Global state
│   ├── data/         # Static song database (150+ tracks)
│   ├── utils/        # Crypto, storage, and password helpers
│   └── App.jsx       # Main routing and lazy loading
├── public/           # PWA assets & AI model weights
├── index.html        # Entry HTML
└── vite.config.js    # Optimized build settings
```

---

## 🛡️ Testing & Quality

- **Security:** Hashed verification codes and secure storage for user sessions.
- **Linting:** ESLint with React-refresh rules.
- **Unit Testing:** Vitest for utility and component logic.
- **Responsive:** Mobile-first design focusing on accessibility.
