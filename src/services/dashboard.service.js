import { httpService } from './http.service'

export const dashboardService = {
    async getDashboard() {
        try {
            const response = await httpService.get('dashboard')
            return response
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Dashboard service error:', err)
            }
            throw err
        }
    }
}

