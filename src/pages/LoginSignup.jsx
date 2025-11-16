import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login, signup } from '../store/user.actions'
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

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        try {
            let user
            if (isSignup) {
                user = await signup(credentials)
                showSuccessMsg(`Welcome, ${user.firstName || user.email}`)
            } else {
                user = await login({ email: credentials.email, password: credentials.password })
                showSuccessMsg(`Welcome back, ${user.firstName || user.email}`)
            }
            navigate('/onboarding')
        } catch (err) {
            const msg = err?.message || 'Authentication failed, try again later.'
            setErrorMsg(msg)
            showErrorMsg(msg)
        }
    }

    return (
        <section className="login-page">
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