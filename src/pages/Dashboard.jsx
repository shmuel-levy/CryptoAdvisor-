import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/user.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { dashboardService } from '../services/dashboard.service'
import { CoinPricesSection } from '../cmps/dashboard/CoinPricesSection'
import { MarketNewsSection } from '../cmps/dashboard/MarketNewsSection'

export function Dashboard() {
  const { user, logout: authLogout } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      setError(null)
      const response = await dashboardService.getDashboard()
      setDashboardData(response)
    } catch (err) {
      console.error('Error loading dashboard:', err)
      const errorMsg = err?.response?.data?.message || 'Failed to load dashboard. Please try again.'
      setError(errorMsg)
      showErrorMsg(errorMsg)
      
      // If 401, redirect to login
      if (err?.response?.status === 401) {
        authLogout()
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await logout()
      authLogout()
      showSuccessMsg('Logged out successfully')
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
      authLogout()
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-content">
          <div className="loading-container">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && !dashboardData) {
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
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={loadDashboard} className="btn-retry">
              Retry
            </button>
          </div>
        </div>
      </section>
    )
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

        {dashboardData?.coinPrices && (
          <CoinPricesSection 
            coins={dashboardData.coinPrices.coins}
            updatedAt={dashboardData.coinPrices.updatedAt}
          />
        )}

        {dashboardData?.marketNews && (
          <MarketNewsSection
            news={dashboardData.marketNews.news}
            count={dashboardData.marketNews.count}
            updatedAt={dashboardData.marketNews.updatedAt}
          />
        )}

        {dashboardData?.aiInsight && !dashboardData.aiInsight.insight && (
          <div className="coming-soon-section">
            <h2>AI Insights</h2>
            <p>Coming soon...</p>
          </div>
        )}

        {dashboardData?.meme && !dashboardData.meme.url && (
          <div className="coming-soon-section">
            <h2>Crypto Memes</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </section>
  )
}