import React, { useState } from 'react'

export function MemeSection({ meme }) {
    const [imageError, setImageError] = useState(false)

    if (!meme || !meme.url) {
        return (
            <div className="meme-section">
                <h2>Crypto Meme of the Day</h2>
                <p className="no-data">No meme available at the moment</p>
            </div>
        )
    }

    function formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    function handleImageError() {
        setImageError(true)
    }

    return (
        <div className="meme-section">
            <div className="meme-header">
                <h2>Crypto Meme of the Day</h2>
                {meme.source && (
                    <span className="meme-source-badge">via {meme.source}</span>
                )}
            </div>

            <div className="meme-content">
                {imageError ? (
                    <div className="meme-error">
                        <p>Image failed to load</p>
                        <p className="meme-url-hint">{meme.url}</p>
                    </div>
                ) : (
                    <img 
                        src={meme.url} 
                        alt={meme.title || 'Crypto meme'}
                        className="meme-image"
                        onError={handleImageError}
                    />
                )}
                
                <div className="meme-info">
                    {meme.title && (
                        <h3 className="meme-title">{meme.title}</h3>
                    )}
                    {meme.description && (
                        <p className="meme-description">{meme.description}</p>
                    )}
                    {meme.fetchedAt && (
                        <p className="meme-date">
                            Fetched: {formatDate(meme.fetchedAt)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

