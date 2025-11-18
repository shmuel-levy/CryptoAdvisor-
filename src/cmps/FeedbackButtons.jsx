import { useState } from 'react'
import { feedbackService } from '../services/feedback.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

// SVG Icons for professional look
const ThumbUpIcon = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
)

const ThumbDownIcon = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
)

export function FeedbackButtons({ sectionType, metadata = {} }) {
    const [userVote, setUserVote] = useState(null) // 'up', 'down', or null
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleVote(vote) {
        // If clicking the same button, remove vote
        if (userVote === vote) {
            setUserVote(null)
            return
        }

        setIsSubmitting(true)
        try {
            await feedbackService.submitFeedback(sectionType, vote, metadata)
            setUserVote(vote)
            showSuccessMsg('Thank you for your feedback!')
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to submit feedback. Please try again.'
            showErrorMsg(errorMsg)
            if (process.env.NODE_ENV === 'development') {
                console.error('Feedback error:', err)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="feedback-buttons">
            <button
                type="button"
                className={`feedback-btn feedback-up ${userVote === 'up' ? 'active' : ''}`}
                onClick={() => handleVote('up')}
                disabled={isSubmitting}
                title="This content is helpful"
                aria-label="Thumbs up - This content is helpful"
            >
                <ThumbUpIcon className="feedback-icon" />
                <span className="feedback-label">Helpful</span>
            </button>
            <button
                type="button"
                className={`feedback-btn feedback-down ${userVote === 'down' ? 'active' : ''}`}
                onClick={() => handleVote('down')}
                disabled={isSubmitting}
                title="This content is not helpful"
                aria-label="Thumbs down - This content is not helpful"
            >
                <ThumbDownIcon className="feedback-icon" />
                <span className="feedback-label">Not helpful</span>
            </button>
        </div>
    )
}

