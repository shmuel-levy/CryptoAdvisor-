/**
 * Storage service abstraction
 * Centralizes all localStorage/sessionStorage operations
 */
export const storageService = {
    // LocalStorage operations
    save(key, value) {
        try {
            if (typeof value === 'string') {
                localStorage.setItem(key, value)
            } else {
                localStorage.setItem(key, JSON.stringify(value))
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error saving to localStorage:', err)
            }
        }
    },

    load(key) {
        try {
            const data = localStorage.getItem(key)
            if (data === null) return null
            
            // Try to parse as JSON, if it fails return as string
            try {
                return JSON.parse(data)
            } catch {
                return data
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error loading from localStorage:', err)
            }
            return null
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key)
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error removing from localStorage:', err)
            }
        }
    },

    clear() {
        try {
            localStorage.clear()
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error clearing localStorage:', err)
            }
        }
    },

    // SessionStorage operations
    saveSession(key, value) {
        try {
            if (typeof value === 'string') {
                sessionStorage.setItem(key, value)
            } else {
                sessionStorage.setItem(key, JSON.stringify(value))
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error saving to sessionStorage:', err)
            }
        }
    },

    loadSession(key) {
        try {
            const data = sessionStorage.getItem(key)
            if (data === null) return null
            
            // Try to parse as JSON, if it fails return as string
            try {
                return JSON.parse(data)
            } catch {
                return data
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error loading from sessionStorage:', err)
            }
            return null
        }
    },

    removeSession(key) {
        try {
            sessionStorage.removeItem(key)
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error removing from sessionStorage:', err)
            }
        }
    },

    clearSession() {
        try {
            sessionStorage.clear()
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error clearing sessionStorage:', err)
            }
        }
    }
}

