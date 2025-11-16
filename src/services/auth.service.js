import { storageService } from './storage.service'

/**
 * Authenticated fetch utility that automatically adds JWT token
 * and handles 401 errors by clearing auth and redirecting to login
 */
export async function fetchWithAuth(endpoint, options = {}) {
  const token = storageService.load('authToken')

  if (!token) {
    throw new Error('No authentication token found')
  }

  const { method = 'GET', body, headers = {} } = options

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  }

  try {
    const response = await fetch(`${getBaseUrl()}${endpoint}`, config)

    if (response.status === 401) {
      // Clear auth and redirect to login
      storageService.remove('authToken')
      storageService.remove('authUser')
      storageService.clearSession()
      window.location.href = '/login'
      throw new Error('Authentication failed. Please login again.')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('fetchWithAuth error:', error)
    throw error
  }
}

function getBaseUrl() {
  return process.env.NODE_ENV === 'production'
    ? '/api/'
    : 'http://localhost:3030/api/'
}

