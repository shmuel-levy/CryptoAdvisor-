import { httpService } from './http.service'

export const preferencesService = {
    async getPreferences() {
        try {
            const response = await httpService.get('user/preferences')
            // Backend returns: { preferences: {...}, completedOnboarding: true }
            // or { preferences: null, completedOnboarding: false }
            return response
        } catch (err) {
            // If 404 or no preferences, return null
            if (err.response?.status === 404 || err.response?.status === 401) {
                return { preferences: null, completedOnboarding: false }
            }
            throw err
        }
    },

    async savePreferences(preferences) {
        try {
            const response = await httpService.post('user/preferences', preferences)
            // Backend returns: { success: true, message: "...", preferences: {...} }
            return response
        } catch (err) {
            // Better error handling for 404
            if (err.response?.status === 404) {
                throw new Error('Preferences endpoint not found. Please check that the backend route /api/user/preferences is implemented.')
            }
            throw err
        }
    },

    async updatePreferences(preferences) {
        const response = await httpService.put('user/preferences', preferences)
        return response
    }
}

