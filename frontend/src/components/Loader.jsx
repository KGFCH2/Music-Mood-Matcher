import React, { useEffect } from 'react'
import './loader.css'

// Silent loader with musical visuals (no audio)
export default function Loader({ onDone }) {
  useEffect(() => {
    // show loader for a short intro then call onDone to reveal the homepage
    const introDuration = 1200
    const t = setTimeout(() => {
      try { if (typeof onDone === 'function') onDone() } catch {}
    }, introDuration)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mm-loader" role="status" aria-label="Loading Music Mood Matcher">
      <div className="loader-card">
        <div className="loader-visual">
          <div className="circle c1"></div>
          <div className="circle c2"></div>

          <div className="equalizer" aria-hidden>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
          </div>

          <div className="note n1">♪</div>
          <div className="note n2">♫</div>
          <div className="note n3">🎵</div>
        </div>

        <div className="loader-text">
          <h1>Music Mood Matcher</h1>
          <p className="creators">Made by <strong>Debasmita Bose</strong> & <strong>Babin Bid</strong></p>
        </div>
      </div>
    </div>
  )
}
