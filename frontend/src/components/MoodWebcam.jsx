import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { songs } from '../data/songs';
import './moodwebcam.css';

const moodMap = {
  happy: 'cheerful',
  sad: 'sad',
  neutral: 'calm',
  surprised: 'existential',
  angry: 'sad',
  fearful: 'calm',
  disgusted: 'existential',
  tired: 'calm',
};

const playlistMap = {
  cheerful: 'happy',
  sad: 'sad',
  calm: 'chill',
  existential: 'energetic',
};

function getPlaylistFromMood(mood) {
  const mapped = playlistMap[mood] || 'happy';
  return songs[mapped] ? songs[mapped].slice(0, 5) : [];
}

function MoodWebcam() {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      setModelsLoaded(true);
      setLoading(false);
    };
    loadModels();
  }, []);

  const analyzeMood = async () => {
    if (!modelsLoaded || !webcamRef.current) {
      setFeedback('AI models not loaded yet.');
      return;
    }
    const video = webcamRef.current.video;
    if (!video) {
      setFeedback('Webcam not ready.');
      return;
    }
    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    if (!detections) {
      setDetectedMood(null);
      setPlaylist([]);
      setFeedback('No face detected. Please face the camera.');
      return;
    }
    if (detections && detections.expressions) {
      const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
      const topExpression = sorted[0][0];
      let mood = 'neutral';
      if (topExpression === 'happy') mood = 'happy';
      else if (topExpression === 'sad') mood = 'sad';
      else if (topExpression === 'angry') mood = 'angry';
      else if (topExpression === 'surprised' || topExpression === 'disgusted') mood = 'existential';
      else if (topExpression === 'fearful' || topExpression === 'neutral') mood = 'tired';
      setDetectedMood(mood);
      setPlaylist(getPlaylistFromMood(moodMap[mood]));
      setFeedback('');
    } else {
      setDetectedMood(null);
      setPlaylist([]);
      setFeedback('No mood detected. Try changing your expression.');
    }
  };

  // Run detection every second automatically
  useEffect(() => {
    let interval;
    if (modelsLoaded) {
      interval = setInterval(() => {
        analyzeMood();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div className="moodwebcam-root">
      <div className="moodwebcam-privacy">🔒 No images are stored. Analysis is local and instant.</div>
      <div className="moodwebcam-cam">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
        />
      </div>
      <div style={{ margin: '1rem 0', color: '#ff1493', fontWeight: 600 }}>
        {loading ? 'Loading AI models...' : feedback}
      </div>
      {detectedMood && (
        <div className="moodwebcam-result">
          <h3>Your mood: <span className="moodwebcam-mood">{detectedMood}</span></h3>
          <h4>Playlist for you:</h4>
          <ul className="moodwebcam-playlist">
            {playlist.map(song => (
              <li key={song.title} className="moodwebcam-song">
                <span className="moodwebcam-song-title">{song.title}</span> by <span className="moodwebcam-song-artist">{song.artist}</span>
                <a href={song.url} target="_blank" rel="noreferrer" className="moodwebcam-play-btn">▶️ Play</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MoodWebcam;
