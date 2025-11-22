import React, { useState } from 'react'
import { songs } from '../data/songs'
import './crushmode.css'

const questions = [
  {
    id: 1,
    text: "What's your crush's favorite color?",
    options: ['Red', 'Blue', 'Pink', 'Yellow', 'Green', 'Other']
  },
  {
    id: 2,
    text: "How would you describe your crush's vibe?",
    options: ['Energetic', 'Chill', 'Romantic', 'Happy', 'Mysterious']
  },
  {
    id: 3,
    text: "Pick a cute activity you'd do together:",
    options: ['Watch a movie', 'Go for a walk', 'Dance', 'Cook', 'Sing karaoke']
  },
  {
    id: 4,
    text: "What kind of message do you want your playlist to send?",
    options: ['I like you!', 'You make me smile', 'Let’s have fun!', 'You’re special', 'Secret crush']
  }
]

function getMoodFromAnswers(answers) {
  // Simple mapping for demo purposes
  if (answers[1] === 'Romantic' || answers[3] === 'You’re special') return 'romantic'
  if (answers[1] === 'Energetic' || answers[3] === 'Let’s have fun!') return 'energetic'
  if (answers[1] === 'Chill' || answers[2] === 'Go for a walk') return 'chill'
  if (answers[1] === 'Happy' || answers[3] === 'You make me smile') return 'happy'
  return 'romantic'
}

function CrushMode() {
  const [crushName, setCrushName] = useState('')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [playlist, setPlaylist] = useState([])

  const handleStart = () => {
    if (crushName.trim()) setStep(1)
  }

  const handleAnswer = (answer) => {
    setAnswers(prev => [...prev, answer])
    if (step < questions.length) {
      setStep(step + 1)
    } else {
      // Generate playlist
      const mood = getMoodFromAnswers([...answers, answer])
      const moodSongs = songs[mood] || []
      // Pick 5 random songs
      const selected = moodSongs.sort(() => 0.5 - Math.random()).slice(0, 5)
      setPlaylist(selected)
      setStep('done')
    }
  }

  const handleRestart = () => {
    setCrushName('')
    setStep(0)
    setAnswers([])
    setPlaylist([])
  }

  return (
    <div className="crushmode-root">
      {step === 0 && (
        <div className="crushmode-step">
          <label>
            Enter your crush's name:
            <input
              type="text"
              value={crushName}
              onChange={e => setCrushName(e.target.value)}
              placeholder="Crush's name"
              className="crushmode-input"
            />
          </label>
          <button className="crushmode-btn" onClick={handleStart} disabled={!crushName.trim()}>
            Start →
          </button>
        </div>
      )}
      {step > 0 && step <= questions.length && (
        <div className="crushmode-step">
          <h3>Question {step} of 4</h3>
          <p>{questions[step - 1].text}</p>
          <div className="crushmode-options">
            {questions[step - 1].options.map(opt => (
              <button key={opt} className="crushmode-btn" onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 'done' && (
        <div className="crushmode-result">
          <h3>Playlist for {crushName} 💌</h3>
          <ul className="crushmode-playlist">
            {playlist.map(song => (
              <li key={song.title} className="crushmode-song">
                <span className="crushmode-song-title">{song.title}</span> by <span className="crushmode-song-artist">{song.artist}</span>
                <a href={song.url} target="_blank" rel="noreferrer" className="crushmode-play-btn">▶️ Play</a>
              </li>
            ))}
          </ul>
          <button className="crushmode-btn" onClick={handleRestart}>Try Again</button>
        </div>
      )}
    </div>
  )
}

export default CrushMode
