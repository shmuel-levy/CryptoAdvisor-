import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/user.actions'
import { showSuccessMsg } from '../services/event-bus.service'

export function Dashboard() {
  const { user, logout: authLogout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      authLogout()
      showSuccessMsg('Logged out successfully')
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
      // Still clear local auth even if backend call fails
      authLogout()
      navigate('/login')
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            {user && (
              <span className="user-greeting">
                Welcome, {user.firstName || user.email}
              </span>
            )}
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
        <p>
          This will become the personalized crypto dashboard with news, prices,
          AI insight, and memes.
        </p>
      </div>
    </section>
  )
}