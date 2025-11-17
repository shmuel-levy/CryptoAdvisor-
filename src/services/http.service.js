import Axios from 'axios'
import { storageService } from './storage.service'

// Use environment variable for API URL, fallback to localhost for development
// Normalize URL to always end with / and ensure /api/ is included
function getBaseUrl() {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3030/api'
    // Remove trailing slash if present, then add /api/ if not already included
    let baseUrl = envUrl.replace(/\/$/, '')
    
    // If URL doesn't end with /api, add it
    if (!baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.endsWith('/') ? baseUrl + 'api' : baseUrl + '/api'
    }
    
    // Ensure it ends with /
    return baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
}

const BASE_URL = getBaseUrl()

const axios = Axios.create({ withCredentials: true })

// Add token to requests if available
axios.interceptors.request.use(
    (config) => {
        const token = storageService.load('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle 401 responses globally
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data
            storageService.remove('authToken')
            storageService.remove('authUser')
            storageService.clearSession()
            // Redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    // Remove leading slash from endpoint if present, then combine with BASE_URL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = `${BASE_URL}${cleanEndpoint}`
    const params = (method === 'GET') ? data : null

    // Debug logging (always show in browser for troubleshooting)
    if (typeof window !== 'undefined') {
        console.log(`[HTTP ${method}] ${url}`)
        console.log(`[BASE_URL] ${BASE_URL}`)
        console.log(`[ENV VITE_API_URL] ${import.meta.env.VITE_API_URL}`)
    }

    const options = { url, method, data, params }

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
            console.dir(err)
        }
        throw err
    }
}