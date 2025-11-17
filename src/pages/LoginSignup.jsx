import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { login, signup } from '../store/user.actions'
import { preferencesService } from '../services/preferences.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function LoginSignup() {
    const [isSignup, setIsSignup] = useState(false)
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    })
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()
    const { login: authLogin } = useAuth()

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        try {
            let response
            if (isSignup) {
                response = await signup(credentials)
                showSuccessMsg(`Welcome, ${response.user.firstName || response.user.email}`)
            } else {
                response = await login({ email: credentials.email, password: credentials.password })
                showSuccessMsg(`Welcome back, ${response.user.firstName || response.user.email}`)
            }
            
            // Store token and user in AuthContext
            authLogin(response.token, response.user)
            
            // Check if user has completed onboarding
            try {
                const prefsResponse = await preferencesService.getPreferences()
                if (prefsResponse?.preferences?.completedOnboarding || prefsResponse?.completedOnboarding) {
                    navigate('/dashboard')
                } else {
                    navigate('/onboarding')
                }
            } catch (err) {
                // If error checking preferences, go to onboarding
                navigate('/onboarding')
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Authentication failed, try again later.'
            setErrorMsg(msg)
            showErrorMsg(msg)
        }
    }

    return (
        <section className="login-page">
            <video
                className="login-video-bg"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/videos/login-bg.mp4" type="video/mp4" />
                <source src="/videos/login-bg.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
            <div className="main-container">
                <h1>Moveo AI Crypto Advisor</h1>
                <h3>{isSignup ? 'Create your account' : 'Log in to your account'}</h3>

                {errorMsg && <div className="login-error-msg">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />

                    {isSignup && (
                        <>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={credentials.firstName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={credentials.lastName}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="btn-login">
                        {isSignup ? 'Sign up' : 'Login'}
                    </button>
                </form>

                <p className="already-user">
                    {isSignup ? 'Already have an account?' : `Don't have an account yet?`}{' '}
                    <button
                        type="button"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Log in' : 'Sign up'}
                    </button>
                </p>
            </div>
        </section>
    )
}