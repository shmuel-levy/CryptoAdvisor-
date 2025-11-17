import React, { useState, useMemo } from 'react'

// Available meme images in public/imgs folder
const MEME_IMAGES = [
    'alt coins are pumping.png',
    'bitcoin-memes-2024.png',
    'john-wick-vs-john-weak-crypto-meme.png',
    'remember all of that money we saved for the house.jpeg',
    'should I sell bitcoin.png',
    'trading crypto.jpg',
    'unnamed (1).png',
    'unnamed.png'
]

export function MemeSection({ meme }) {
    const [imageError, setImageError] = useState(false)
    
    // Randomly select a meme image on component mount
    const randomMemeImage = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * MEME_IMAGES.length)
        return `/imgs/${MEME_IMAGES[randomIndex]}`
    }, [])

    if (!meme) {
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
                        <p className="meme-url-hint">{randomMemeImage}</p>
                    </div>
                ) : (
                    <img 
                        src={randomMemeImage} 
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

