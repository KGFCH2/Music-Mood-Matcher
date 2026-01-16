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
      try {
        setLoading(true);
        // Load models from CDN (jsDelivr) - no local files needed
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        setFeedback('');
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setFeedback('Failed to load AI models. Check your internet connection.');
      } finally {
        setLoading(false);
      }
    };
    loadModels();
  }, []);

  const analyzeMood = async () => {
    if (!modelsLoaded || !webcamRef.current) {
      setFeedback('AI models not loaded yet.');
      return;
    }
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4 || video.videoWidth === 0) {
      // readyState 4 means HaveEnoughData, but we also check videoWidth
      return;
    }

    try {
      const detections = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();

      if (!detections) {
        setDetectedMood(null);
        setPlaylist([]);
        setFeedback('No face detected. Please face the camera.');
        return;
      }

      // Check for valid box dimensions to prevent face-api internal errors
      if (!detections.detection || !detections.detection.box ||
        detections.detection.box.width === 0 ||
        detections.detection.box.height === 0) {
        return;
      }
      if (detections && detections.expressions) {
        const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
        const topExpression = sorted[0][0];
        // show the raw detected expression (happy, sad, neutral, etc.) to the user
        setDetectedMood(topExpression);
        // map expression -> intermediate category -> playlist
        const category = moodMap[topExpression] || 'cheerful';
        setPlaylist(getPlaylistFromMood(category));
        setFeedback('');
      } else {
        setDetectedMood(null);
        setPlaylist([]);
        setFeedback('No mood detected. Try changing your expression.');
      }
    } catch (error) {
      console.error('Mood detection error capture:', error);
      // Fail silently for interval performance, or set a subtle error if constant 
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
