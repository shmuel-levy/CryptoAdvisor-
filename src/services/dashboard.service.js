import { httpService } from './http.service'

export const dashboardService = {
    async getDashboard() {
        try {
            const response = await httpService.get('dashboard')
            return response
        } catch (err) {
            console.error('Dashboard service error:', err)
            throw err
        }
    }
}

