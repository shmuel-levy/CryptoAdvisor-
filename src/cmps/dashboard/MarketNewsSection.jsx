import React from 'react'
import { FeedbackButtons } from '../FeedbackButtons'

export function MarketNewsSection({ news, count, updatedAt }) {
    if (!news || news.length === 0) {
        return (
            <div className="market-news-section">
                <h2>Market News</h2>
                <p className="no-data">No news available at the moment</p>
            </div>
        )
    }

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="market-news-section">
            <div className="section-header">
                <div className="header-left">
                    <div className="header-title">
                        <h2>Market News</h2>
                        {count > 0 && (
                            <span className="news-count">{count} articles</span>
                        )}
                    </div>
                    {updatedAt && (
                        <p className="updated-at">
                            Updated: {formatDate(updatedAt)}
                        </p>
                    )}
                </div>
                <FeedbackButtons sectionType="marketNews" />
            </div>

            <div className="news-list">
                {news.map((article) => (
                    <div key={article.id} className="news-card">
                        <div className="news-card-header">
                            <h3>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-title"
                                >
                                    {article.title}
                                </a>
                            </h3>
                            {article.votes > 0 && (
                                <span className="news-votes">{article.votes} votes</span>
                            )}
                        </div>

                        <div className="news-meta">
                            <span className="news-source">{article.source}</span>
                            <span className="news-date">
                                {formatDate(article.publishedAt)}
                            </span>
                            {article.currencies && article.currencies.length > 0 && (
                                <span className="news-currencies">
                                    {article.currencies.join(', ')}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

