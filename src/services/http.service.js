import Axios from 'axios'
import { storageService } from './storage.service'

// Use environment variable for API URL, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api/'

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
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null

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