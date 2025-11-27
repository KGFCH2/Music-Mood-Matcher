import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize - restore user session from localStorage on mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('musicMoodUser')
            if (savedUser) {
                setUser(JSON.parse(savedUser))
            }
        } catch (error) {
            console.error('Error restoring user session:', error)
            localStorage.removeItem('musicMoodUser')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('musicMoodUser', JSON.stringify(userData))
    }

    const updateUser = (updatedData) => {
        const updated = { ...user, ...updatedData }
        setUser(updated)
        localStorage.setItem('musicMoodUser', JSON.stringify(updated))
        // Also update in the users list if email matches
        try {
            const savedUsers = localStorage.getItem('musicMoodUsers')
            if (savedUsers) {
                const users = JSON.parse(savedUsers)
                const updatedUsers = users.map(u => u.email === user.email ? updated : u)
                localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))
            }
        } catch (error) {
            console.error('Error updating users list:', error)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('musicMoodUser')
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
