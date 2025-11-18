import { httpService } from './http.service'

export const feedbackService = {
    /**
     * Submit feedback for a dashboard section
     * @param {string} sectionType - Type of section: 'coinPrices', 'marketNews', 'aiInsight', 'meme'
     * @param {string} vote - 'up' or 'down'
     * @param {object} metadata - Optional metadata (e.g., { coinId: 'bitcoin', articleId: 'news123' })
     * @returns {Promise} Response from backend
     */
    async submitFeedback(sectionType, vote, metadata = {}) {
        try {
            const response = await httpService.post('user/feedback', {
                sectionType,
                vote, // 'up' or 'down'
                metadata,
                timestamp: new Date().toISOString()
            })
            return response
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Feedback submission error:', err)
            }
            throw err
        }
    },

    /**
     * Get user's feedback history (optional - for showing previous votes)
     * @returns {Promise} Array of feedback objects
     */
    async getFeedbackHistory() {
        try {
            const response = await httpService.get('user/feedback')
            return response
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Get feedback error:', err)
            }
            // If endpoint doesn't exist, return empty array
            if (err.response?.status === 404) {
                return { feedback: [] }
            }
            throw err
        }
    }
}

