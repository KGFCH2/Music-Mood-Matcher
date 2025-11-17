import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize user from localStorage
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('musicMoodUser')
            if (savedUser) {
                setUser(JSON.parse(savedUser))
            }
        } catch (err) {
            console.error('Error loading user from localStorage:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('musicMoodUser', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('musicMoodUser')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
