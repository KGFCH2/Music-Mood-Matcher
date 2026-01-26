import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import {
    FaFilm,
    FaUser,
    FaUserCircle,
    FaEnvelope,
    FaVenusMars,
    FaPlay,
    FaStar,
    FaBolt,
    FaHeadphones,
    FaPalette,
    FaSync,
    FaMusic,
    FaGlobe,
    FaArrowLeft,
    FaMicrophone,
    FaMars,
    FaVenus,
    FaGenderless
} from 'react-icons/fa'
import './demo-guide.css'

export default function DemoGuide({ onSelectDemo, onBack }) {
    const [selectedDemo, setSelectedDemo] = useState(null)
    const [showFeatures, setShowFeatures] = useState(true)

    const DEMO_USERS = [
        {
            id: 1,
            email: 'demo.music.lover@example.com',
            name: 'Music Lover',
            gender: 'male',
            icon: <FaMars />,
            description: 'A passionate music enthusiast exploring different moods',
            color: '#FFD700'
        },
        {
            id: 2,
            email: 'demo.happy.vibes@example.com',
            name: 'Happy Vibes',
            gender: 'female',
            icon: <FaVenus />,
            description: 'Always looking for uplifting and energetic songs',
            color: '#FF1493'
        },
        {
            id: 3,
            email: 'demo.chill.mode@example.com',
            name: 'Chill Mode',
            gender: 'other',
            icon: <FaGenderless style={{ color: '#000000' }} />,
            description: 'Prefers relaxing music for peaceful moments',
            color: '#20B2AA'
        },
        {
            id: 4,
            email: 'demo.rock.fan@example.com',
            name: 'Rock Fan',
            gender: 'male',
            icon: <FaUser />,
            description: 'Loves energetic rock and metal music vibes',
            color: '#FF6347'
        },
        {
            id: 5,
            email: 'demo.jazz.lover@example.com',
            name: 'Jazz Lover',
            gender: 'female',
            icon: <FaUserCircle />,
            description: 'Enjoys smooth jazz and sophisticated melodies',
            color: '#9370DB'
        },
        {
            id: 6,
            email: 'demo.pop.star@example.com',
            name: 'Pop Star',
            gender: 'other',
            icon: <FaMicrophone />,
            description: 'Explores trending pop and contemporary sounds',
            color: '#00CED1'
        }
    ]

    const handleDemoLogin = (demoUser) => {
        const demoUserData = {
            email: demoUser.email,
            userName: demoUser.name,
            gender: demoUser.gender,
            userId: 'demo-' + Math.random().toString(36).substr(2, 9),
            registeredAt: new Date().toISOString(),
            loginHistory: [new Date().toISOString()],
            isVerified: true,
            verificationCode: 'DEMO123',
            isDemo: true
        }

        localStorage.setItem('musicMoodUser', JSON.stringify(demoUserData))
        onSelectDemo(demoUserData)
    }

    return (
        <div className="demo-guide-container">
            <div className="demo-background">
                <div className="demo-note note-1">♪</div>
                <div className="demo-note note-2">♫</div>
                <div className="demo-note note-3">🎵</div>
                <div className="demo-note note-4">♪</div>
                <div className="demo-note note-5">♫</div>
                <div className="demo-note note-6">🎶</div>
            </div>

            <motion.div
                className="demo-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Header */}
                <motion.div
                    className="demo-header"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="demo-header-icon"><FaFilm /></div>
                    <h1>Demo Accounts</h1>
                    <p className="demo-subtitle">Choose a demo account to explore the app instantly!</p>
                </motion.div>

                {/* Demo Users Grid */}
                <div className="demo-users-grid">
                    {DEMO_USERS.map((demoUser, idx) => (
                        <motion.div
                            key={demoUser.id}
                            className="demo-user-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15, duration: 0.4 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={() => {
                                setSelectedDemo(demoUser.id)
                                setTimeout(() => handleDemoLogin(demoUser), 300)
                            }}
                        >
                            {/* Avatar */}
                            <div className="demo-avatar" style={{ borderColor: demoUser.color }}>
                                <span className="demo-avatar-emoji">{demoUser.icon}</span>
                            </div>

                            {/* User Info */}
                            <h3 className="demo-user-name">{demoUser.name}</h3>
                            <p className="demo-user-description">{demoUser.description}</p>

                            {/* Email */}
                            <div className="demo-email-box">
                                <span className="email-icon"><FaEnvelope /></span>
                                <span className="email-text">{demoUser.email}</span>
                            </div>

                            {/* Gender Badge */}
                            <div className="demo-gender-badge">
                                <span className="gender-emoji"><FaVenusMars /></span>
                                <span className="gender-text">{demoUser.gender.charAt(0).toUpperCase() + demoUser.gender.slice(1)}</span>
                            </div>

                            {/* Login Button */}
                            <motion.button
                                className="demo-login-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: `linear-gradient(135deg, ${demoUser.color}80, ${demoUser.color}40)`,
                                    borderColor: demoUser.color
                                }}
                            >
                                <span className="btn-icon"><FaPlay /></span>
                                <span className="btn-text">Try Demo</span>
                            </motion.button>

                            {selectedDemo === demoUser.id && (
                                <motion.div
                                    className="login-spinner"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="spinner"></div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Features Toggle Button (Mobile Only) */}
                <motion.button
                    className="demo-features-toggle"
                    onClick={() => setShowFeatures(!showFeatures)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                >
                    <span className="btn-icon">{showFeatures ? '🔽' : '🔼'}</span>
                    <span className="btn-text">{showFeatures ? 'Hide Features' : 'Show Features'}</span>
                </motion.button>

                {/* Features Section */}
                <AnimatePresence>
                    {showFeatures && (
                        <motion.div
                            className="demo-features"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="features-title"><FaStar style={{ color: '#fff700', marginRight: '8px' }} /> Why Try Demo?</h3>
                            <div className="features-grid">
                                <div className="feature-item">
                                    <div className="feature-icon emoji-pop emoji-demo-instant">
                                        <FaBolt style={{ color: '#FFD700', transition: 'all 0.4s ease' }} />
                                    </div>
                                    <p>Instant Access</p>
                                    <span>No verification needed</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon emoji-pop emoji-demo-full">
                                        <FaHeadphones style={{ color: '#00c8ff', transition: 'all 0.4s ease' }} />
                                    </div>
                                    <p>Full Features</p>
                                    <span>All features unlocked</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon emoji-pop emoji-demo-ui">
                                        <FaPalette style={{ color: '#FF1493', transition: 'all 0.4s ease' }} />
                                    </div>
                                    <p>Beautiful UI</p>
                                    <span>Experience the design</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon emoji-pop emoji-demo-reuse">
                                        <FaSync style={{ color: '#20B2AA', transition: 'all 0.4s ease' }} />
                                    </div>
                                    <p>Reusable</p>
                                    <span>Use anytime you want</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon emoji-pop emoji-demo-moods">
                                        <FaMusic style={{ color: '#FF6347', transition: 'all 0.4s ease' }} />
                                    </div>
                                    <p>6 Moods</p>
                                    <span>Explore all emotions</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon emoji-pop emoji-demo-lang">
                                        <FaGlobe style={{ color: '#00CED1', transition: 'all 0.4s ease' }} />
                                    </div>
                                    <p>Multi-Language</p>
                                    <span>English, Hindi & Bengali</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back Button */}
                <motion.button
                    className="demo-back-btn"
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                >
                    <span className="btn-icon"><FaArrowLeft /></span>
                    <span className="btn-text">Back to Login</span>
                </motion.button>
            </motion.div>
        </div>
    )
}

DemoGuide.propTypes = {
    onSelectDemo: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
}
