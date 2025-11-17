import React, { createContext, useContext, useState, useEffect } from 'react'
import { storageService } from '../services/storage.service'

const AuthContext = createContext(null)

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  function clearAuth() {
    storageService.remove(TOKEN_KEY)
    storageService.remove(USER_KEY)
    storageService.removeSession('loggedinUser')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  // Load token and user from storage on mount
  useEffect(() => {
    const storedToken = storageService.load(TOKEN_KEY)
    const storedUser = storageService.load(USER_KEY)

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(storedUser)
        setIsAuthenticated(true)
      } catch (err) {
        console.error('Error loading auth data:', err)
        clearAuth()
      }
    }
    setIsLoading(false)
  }, [])

  function login(authToken, userData) {
    storageService.save(TOKEN_KEY, authToken)
    storageService.save(USER_KEY, userData)
    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
  }

  function logout() {
    clearAuth()
  }

  const value = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

