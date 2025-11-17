import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { preferencesService } from '../services/preferences.service'

export function OnboardingGuard({ children }) {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        async function checkOnboarding() {
            if (!isAuthenticated || isLoading) {
                setIsChecking(false)
                return
            }

            try {
                const response = await preferencesService.getPreferences()
                if (response?.preferences?.completedOnboarding || response?.completedOnboarding) {
                    navigate('/dashboard', { replace: true })
                } else {
                    setIsChecking(false)
                }
            } catch (err) {
                // If error, allow access to onboarding
                setIsChecking(false)
            }
        }

        checkOnboarding()
    }, [isAuthenticated, isLoading, navigate])

    if (isLoading || isChecking) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        )
    }

    return children
}

