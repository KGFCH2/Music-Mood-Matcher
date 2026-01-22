import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { secureStorage } from '../utils/secureStorage'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize - restore user session from secure storage on mount
    useEffect(() => {
        try {
            const savedUser = secureStorage.getUserInfo()
            if (savedUser && savedUser.isVerified) {
                setUser(savedUser)
                // Keep user data in memory for quick access
                secureStorage.setSessionData('currentUser', savedUser)
            }
        } catch (error) {
            // Silent fail - don't expose error details
            secureStorage.clearAllStorage()
        } finally {
            setIsLoading(false)
        }
    }, [])

    const login = (userData) => {
        // Only store non-sensitive user info (email, userName, gender, etc.)
        const safeUserData = {
            email: userData.email,
            userName: userData.userName,
            gender: userData.gender,
            userId: userData.userId,
            registeredAt: userData.registeredAt,
            isVerified: userData.isVerified,
            isDemo: userData.isDemo || false
        }

        setUser(safeUserData)
        secureStorage.setUserInfo(safeUserData)
        secureStorage.setSessionData('currentUser', safeUserData)
    }

    const updateUser = (updatedData) => {
        const updated = { ...user, ...updatedData }
        setUser(updated)

        // Only store safe user info
        const safeUserData = {
            email: updated.email,
            userName: updated.userName,
            gender: updated.gender,
            userId: updated.userId,
            registeredAt: updated.registeredAt,
            isVerified: updated.isVerified,
            isDemo: updated.isDemo || false
        }

        secureStorage.setUserInfo(safeUserData)
        secureStorage.setSessionData('currentUser', safeUserData)

        // Also update in the users list if email matches
        try {
            const savedUsers = secureStorage.getRegisteredUsers()
            if (savedUsers) {
                const updatedUsers = savedUsers.map(u => u.email === user.email ? safeUserData : u)
                secureStorage.setRegisteredUsers(updatedUsers)
            }
        } catch (error) {
            // Silent fail - don't expose error details
        }
    }

    const logout = () => {
        setUser(null)
        secureStorage.clearAllStorage()
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}

// Custom hook to use auth context
export function useAuth() {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
