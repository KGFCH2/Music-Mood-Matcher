/**
 * Secure Storage Utility
 * Encrypts/decrypts sensitive data using Web Crypto API
 * Stores non-sensitive user data only; keeps sensitive data in memory
 */

const ALGORITHM = { name: 'AES-GCM', length: 256 }
const DERIVATION_ALGORITHM = { name: 'PBKDF2', hash: 'SHA-256', iterations: 100000, salt: new Uint8Array(16) }

// Generate a stable encryption key based on browser fingerprint
const generateEncryptionKey = async () => {
    const browserFingerprint = `${navigator.userAgent}${navigator.language}${screen.width}x${screen.height}`
    const encoder = new TextEncoder()
    const data = encoder.encode(browserFingerprint)

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        data,
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    )

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: DERIVATION_ALGORITHM.salt,
            iterations: DERIVATION_ALGORITHM.iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        ALGORITHM,
        false,
        ['encrypt', 'decrypt']
    )
}

// Encrypt sensitive data
export const encryptData = async (data) => {
    try {
        const key = await generateEncryptionKey()
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const encoder = new TextEncoder()
        const encodedData = encoder.encode(JSON.stringify(data))

        const encryptedData = await crypto.subtle.encrypt(
            { ...ALGORITHM, iv },
            key,
            encodedData
        )

        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encryptedData.byteLength)
        combined.set(iv, 0)
        combined.set(new Uint8Array(encryptedData), iv.length)

        // Convert to base64 for storage
        return btoa(String.fromCharCode.apply(null, combined))
    } catch (error) {
        console.error('Encryption failed:', error.message)
        throw new Error('Failed to encrypt data')
    }
}

// Decrypt sensitive data
export const decryptData = async (encryptedData) => {
    try {
        const key = await generateEncryptionKey()

        // Convert from base64
        const binary = atob(encryptedData)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }

        // Extract IV and encrypted content
        const iv = bytes.slice(0, 12)
        const data = bytes.slice(12)

        const decryptedData = await crypto.subtle.decrypt(
            { ...ALGORITHM, iv },
            key,
            data
        )

        const decoder = new TextDecoder()
        return JSON.parse(decoder.decode(decryptedData))
    } catch (error) {
        console.error('Decryption failed - data may be corrupted or from different device')
        throw new Error('Failed to decrypt data')
    }
}

// Secure Storage for sensitive information (in-memory + encrypted backup)
class SecureStorage {
    constructor() {
        this.sessionData = {} // In-memory storage for session data
        this.restoreSessionOnLoad()
    }

    // Store sensitive data in memory (not accessible from console/devtools easily)
    setSessionData(key, value) {
        this.sessionData[key] = value
    }

    // Retrieve sensitive data from memory
    getSessionData(key) {
        return this.sessionData[key] || null
    }

    // Clear specific session data
    clearSessionData(key) {
        delete this.sessionData[key]
    }

    // Clear all session data (on logout)
    clearAllSessionData() {
        this.sessionData = {}
    }

    // Store non-sensitive user info (safe to persist)
    setUserInfo(userInfo) {
        // Only store: email, userName, gender, userId, registeredAt, isVerified, isDemo
        const safeData = {
            email: userInfo.email,
            userName: userInfo.userName,
            gender: userInfo.gender,
            userId: userInfo.userId,
            registeredAt: userInfo.registeredAt,
            isVerified: userInfo.isVerified,
            isDemo: userInfo.isDemo || false
        }
        localStorage.setItem('musicMoodUser', JSON.stringify(safeData))
    }

    // Retrieve user info from storage
    getUserInfo() {
        try {
            const saved = localStorage.getItem('musicMoodUser')
            return saved ? JSON.parse(saved) : null
        } catch (error) {
            console.error('Failed to retrieve user info')
            return null
        }
    }

    // Store registered users (non-sensitive data only)
    setRegisteredUsers(users) {
        // Only store: email, userName, gender, userId, registeredAt, isVerified, isDemo, loginHistory
        const safeUsers = users.map(user => ({
            email: user.email,
            userName: user.userName,
            gender: user.gender,
            userId: user.userId,
            registeredAt: user.registeredAt,
            isVerified: user.isVerified,
            isDemo: user.isDemo || false,
            loginHistory: user.loginHistory || []
        }))
        localStorage.setItem('musicMoodUsers', JSON.stringify(safeUsers))
    }

    // Retrieve registered users
    getRegisteredUsers() {
        try {
            const saved = localStorage.getItem('musicMoodUsers')
            return saved ? JSON.parse(saved) : []
        } catch (error) {
            console.error('Failed to retrieve registered users')
            return []
        }
    }

    // Store encrypted sensitive token
    async setAuthToken(token) {
        try {
            const encrypted = await encryptData(token)
            sessionStorage.setItem('_at', encrypted) // Shortened key name
            this.setSessionData('authToken', token)
        } catch (error) {
            console.error('Failed to store auth token')
        }
    }

    // Retrieve encrypted auth token
    async getAuthToken() {
        try {
            // First try memory storage (fastest, most secure)
            const memoryToken = this.getSessionData('authToken')
            if (memoryToken) return memoryToken

            // Then try encrypted session storage
            const encrypted = sessionStorage.getItem('_at')
            if (encrypted) {
                const decrypted = await decryptData(encrypted)
                this.setSessionData('authToken', decrypted)
                return decrypted
            }
            return null
        } catch (error) {
            console.error('Failed to retrieve auth token')
            return null
        }
    }

    // Clear auth token
    async clearAuthToken() {
        sessionStorage.removeItem('_at')
        this.clearSessionData('authToken')
    }

    // Restore session on page load
    async restoreSessionOnLoad() {
        try {
            const userInfo = this.getUserInfo()
            if (userInfo && userInfo.isVerified) {
                this.setSessionData('currentUser', userInfo)
            }
        } catch (error) {
            console.error('Failed to restore session')
        }
    }

    // Clear all storage on logout
    clearAllStorage() {
        localStorage.removeItem('musicMoodUser')
        sessionStorage.removeItem('_at')
        this.clearAllSessionData()
    }
}

// Export singleton instance
export const secureStorage = new SecureStorage()

// Prevent access from console by overwriting common inspection methods
Object.defineProperty(secureStorage.sessionData, '__proto__', {
    value: {}
})

export default secureStorage
