import React from 'react'
import { FeedbackButtons } from '../FeedbackButtons'

export function AIInsightSection({ insight, generatedAt, model }) {
    if (!insight) {
        return (
            <div className="ai-insight-section">
                <h2>AI Insight of the Day</h2>
                <p className="no-data">No insight available at the moment</p>
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
        <div className="ai-insight-section">
            <div className="insight-header">
                <div className="header-left">
                    <h2>AI Insight of the Day</h2>
                    {model && model !== 'fallback' && (
                        <span className="model-badge">Powered by {model}</span>
                    )}
                </div>
                <FeedbackButtons sectionType="aiInsight" />
            </div>

            <div className="insight-content">
                <p className="insight-text">{insight}</p>
                {generatedAt && (
                    <p className="insight-date">
                        Generated: {formatDate(generatedAt)}
                    </p>
                )}
            </div>
        </div>
    )
}

