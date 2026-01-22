/**
 * Password Security Utility
 * Uses Web Crypto API for client-side password hashing
 * Note: Always validate and hash passwords on backend as well
 */

/**
 * Hash password using PBKDF2
 * Client-side hashing adds an extra layer of security
 * Backend should also hash/salt passwords
 */
export const hashPassword = async (password) => {
    try {
        const encoder = new TextEncoder()
        const data = encoder.encode(password)

        const hashBuffer = await crypto.subtle.digest('SHA-256', data)

        // Convert to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        return hashHex
    } catch (error) {
        console.error('Password hashing failed')
        throw new Error('Failed to process password')
    }
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePasswordStrength = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }

    const isStrong = requirements.minLength &&
        requirements.hasUppercase &&
        requirements.hasLowercase &&
        requirements.hasNumber

    const strengthLevel =
        requirements.minLength &&
            requirements.hasUppercase &&
            requirements.hasLowercase &&
            requirements.hasNumber &&
            requirements.hasSpecial ? 'Strong' :
            requirements.minLength &&
                requirements.hasUppercase &&
                requirements.hasLowercase &&
                requirements.hasNumber ? 'Good' : 'Weak'

    return { isStrong, requirements, strengthLevel }
}

/**
 * Get password strength feedback message
 */
export const getPasswordFeedback = (password) => {
    if (!password) return { message: '', color: '' }

    const { requirements, strengthLevel } = validatePasswordStrength(password)

    const missingRequirements = []
    if (!requirements.minLength) missingRequirements.push('8+ characters')
    if (!requirements.hasUppercase) missingRequirements.push('uppercase letter')
    if (!requirements.hasLowercase) missingRequirements.push('lowercase letter')
    if (!requirements.hasNumber) missingRequirements.push('number')

    let message = `Password Strength: ${strengthLevel}`
    if (missingRequirements.length > 0) {
        message += ` - Missing: ${missingRequirements.join(', ')}`
    }

    const color = strengthLevel === 'Strong' ? 'green' :
        strengthLevel === 'Good' ? 'orange' : 'red'

    return { message, color }
}

export default {
    hashPassword,
    validatePasswordStrength,
    getPasswordFeedback
}
