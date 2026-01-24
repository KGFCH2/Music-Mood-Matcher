import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './loader.css'

// Silent loader with musical visuals (no audio)
export default function Loader({ onDone, introDuration = 1200 }) {
  const timeoutRef = useRef(null)
  useEffect(() => {
    // show loader for a short intro then call onDone to reveal the homepage
    timeoutRef.current = setTimeout(() => {
      try {
        if (typeof onDone === 'function') onDone()
      } catch (err) {
        // swallow errors from caller to avoid crashing the loader
      }
    }, introDuration)
    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mm-loader" role="status" aria-label="Loading Music Mood Matcher" aria-busy="true">
      <div className="loader-card">
        <div className="loader-visual">
          <div className="circle c1"></div>
          <div className="circle c2"></div>

          <div className="equalizer" aria-hidden="true">
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
          <p className="creators">Made by <strong>Babin Bid</strong> & <strong>Debasmita Bose</strong></p>
        </div>
      </div>
    </div>
  )
}

Loader.propTypes = {
  onDone: PropTypes.func,
  // duration before calling onDone (ms)
  introDuration: PropTypes.number,
}
