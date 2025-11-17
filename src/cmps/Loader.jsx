import React from 'react'

export function Loader() {
    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <img 
                    src="/videos/unnamed.gif" 
                    alt="Loading..." 
                    className="loader-gif"
                />
            </div>
        </div>
    )
}

