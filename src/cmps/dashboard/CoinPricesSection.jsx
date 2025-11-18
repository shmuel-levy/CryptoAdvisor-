import React from 'react'
import { FeedbackButtons } from '../FeedbackButtons'

export function CoinPricesSection({ coins, updatedAt }) {
    if (!coins || coins.length === 0) {
        return (
            <div className="coin-prices-section">
                <h2>Coin Prices</h2>
                <p className="no-data">No coin data available</p>
            </div>
        )
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price)
    }

    function formatChange(change) {
        const sign = change >= 0 ? '+' : ''
        return `${sign}${change.toFixed(2)}%`
    }

    return (
        <div className="coin-prices-section">
            <div className="section-header">
                <div className="header-left">
                    <h2>Your Watchlist</h2>
                    {updatedAt && (
                        <p className="updated-at">
                            Last updated: {new Date(updatedAt).toLocaleString()}
                        </p>
                    )}
                </div>
                <FeedbackButtons sectionType="coinPrices" />
            </div>
            
            <div className="coins-grid">
                {coins.map((coin) => (
                    <div key={coin.id} className="coin-card">
                        <div className="coin-header">
                            <h3>{coin.symbol.toUpperCase()}</h3>
                            <span className="coin-id">{coin.id}</span>
                        </div>
                        
                        <div className="coin-price">
                            {formatPrice(coin.price)}
                        </div>
                        
                        <div className="coin-changes">
                            <div className="change-item">
                                <span className="label">24h:</span>
                                <span className={`change-value ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                                    {formatChange(coin.change24h)}
                                </span>
                            </div>
                            <div className="change-item">
                                <span className="label">7d:</span>
                                <span className={`change-value ${coin.change7d >= 0 ? 'positive' : 'negative'}`}>
                                    {formatChange(coin.change7d)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

