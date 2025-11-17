import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { preferencesService } from '../services/preferences.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { Loader } from '../cmps/Loader'

const CRYPTO_ASSETS = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'BNB', 'XRP', 'Other']
const INVESTOR_TYPES = ['HODLer', 'Day Trader', 'NFT Collector', 'DeFi Enthusiast', 'Swing Trader']
const CONTENT_TYPES = ['Market News', 'Charts', 'Social', 'Fun', 'Technical Analysis', 'Memes']

const STEPS = {
    ASSETS: 1,
    INVESTOR_TYPE: 2,
    CONTENT_TYPES: 3
}

export function Onboarding() {
    const [currentStep, setCurrentStep] = useState(STEPS.ASSETS)
    const [formData, setFormData] = useState({
        interestedAssets: [],
        investorType: '',
        contentTypes: []
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const navigate = useNavigate()

    function handleAssetToggle(asset) {
        setFormData(prev => {
            const assets = prev.interestedAssets.includes(asset)
                ? prev.interestedAssets.filter(a => a !== asset)
                : [...prev.interestedAssets, asset]
            
            if (assets.length > 10) {
                return prev
            }
            
            return { ...prev, interestedAssets: assets }
        })
        setErrors({ ...errors, interestedAssets: '' })
    }

    function handleInvestorTypeChange(type) {
        setFormData(prev => ({ ...prev, investorType: type }))
        setErrors({ ...errors, investorType: '' })
    }

    function handleContentTypeToggle(type) {
        setFormData(prev => {
            const types = prev.contentTypes.includes(type)
                ? prev.contentTypes.filter(t => t !== type)
                : [...prev.contentTypes, type]
            
            if (types.length > 6) {
                return prev
            }
            
            return { ...prev, contentTypes: types }
        })
        setErrors({ ...errors, contentTypes: '' })
    }

    function validateCurrentStep() {
        const newErrors = {}
        
        if (currentStep === STEPS.ASSETS) {
            if (formData.interestedAssets.length === 0) {
                newErrors.interestedAssets = 'Please select at least one crypto asset'
            }
        } else if (currentStep === STEPS.INVESTOR_TYPE) {
            if (!formData.investorType) {
                newErrors.investorType = 'Please select your investor type'
            }
        } else if (currentStep === STEPS.CONTENT_TYPES) {
            if (formData.contentTypes.length === 0) {
                newErrors.contentTypes = 'Please select at least one content type'
            }
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleContinue() {
        if (!validateCurrentStep()) {
            return
        }
        
        if (currentStep < STEPS.CONTENT_TYPES) {
            setCurrentStep(currentStep + 1)
            setErrors({})
        }
    }

    function handleBack() {
        if (currentStep > STEPS.ASSETS) {
            setCurrentStep(currentStep - 1)
            setErrors({})
        }
    }

    function handleStepClick(stepNumber) {
        // Allow navigation to any step
        // User can go back or forward freely
        if (stepNumber >= STEPS.ASSETS && stepNumber <= STEPS.CONTENT_TYPES) {
            setCurrentStep(stepNumber)
            setErrors({})
        }
    }

    async function handleFinish() {
        if (!validateCurrentStep()) {
            return
        }

        setIsSubmitting(true)
        setErrors({})

        try {
            await preferencesService.savePreferences(formData)
            showSuccessMsg('Preferences saved successfully!')
            setShowLoader(true)
            setTimeout(() => {
                navigate('/dashboard')
            }, 5000)
        } catch (err) {
            let errorMsg = 'Failed to save preferences. Please try again.'
            
            // Handle different error types
            if (err.response?.status === 404) {
                errorMsg = 'Backend endpoint not found. Please verify the backend route /api/user/preferences is implemented and the server is running.'
            } else if (err.response?.status === 400) {
                errorMsg = err.response?.data?.message || 'Invalid data. Please check your selections.'
            } else if (err.response?.status === 401) {
                errorMsg = 'Authentication failed. Please log in again.'
            } else if (err.message) {
                errorMsg = err.message
            } else if (err.response?.data?.message) {
                errorMsg = err.response.data.message
            }
            
            setErrors({ general: errorMsg })
            showErrorMsg(errorMsg)
            if (process.env.NODE_ENV === 'development') {
                console.error('Onboarding error:', err)
            }
            setIsSubmitting(false)
        }
    }

    function getStepTitle() {
        switch (currentStep) {
            case STEPS.ASSETS:
                return 'What crypto assets are you interested in?'
            case STEPS.INVESTOR_TYPE:
                return 'What type of investor are you?'
            case STEPS.CONTENT_TYPES:
                return 'What kind of content would you like to see?'
            default:
                return ''
        }
    }

    function getStepHint() {
        switch (currentStep) {
            case STEPS.ASSETS:
                return 'Select up to 10 assets'
            case STEPS.CONTENT_TYPES:
                return 'Select up to 6 content types'
            default:
                return ''
        }
    }

    function renderStepContent() {
        switch (currentStep) {
            case STEPS.ASSETS:
                return (
                    <div className="options-grid">
                        {CRYPTO_ASSETS.map(asset => (
                            <button
                                key={asset}
                                type="button"
                                className={`option-button ${formData.interestedAssets.includes(asset) ? 'selected' : ''}`}
                                onClick={() => handleAssetToggle(asset)}
                            >
                                {asset}
                            </button>
                        ))}
                    </div>
                )

            case STEPS.INVESTOR_TYPE:
                return (
                    <div className="options-list">
                        {INVESTOR_TYPES.map(type => (
                            <label key={type} className="radio-option">
                                <input
                                    type="radio"
                                    name="investorType"
                                    value={type}
                                    checked={formData.investorType === type}
                                    onChange={() => handleInvestorTypeChange(type)}
                                />
                                <span>{type}</span>
                            </label>
                        ))}
                    </div>
                )

            case STEPS.CONTENT_TYPES:
                return (
                    <div className="options-grid">
                        {CONTENT_TYPES.map(type => (
                            <button
                                key={type}
                                type="button"
                                className={`option-button ${formData.contentTypes.includes(type) ? 'selected' : ''}`}
                                onClick={() => handleContentTypeToggle(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                )

            default:
                return null
        }
    }

    function getCurrentStepError() {
        if (currentStep === STEPS.ASSETS) return errors.interestedAssets
        if (currentStep === STEPS.INVESTOR_TYPE) return errors.investorType
        if (currentStep === STEPS.CONTENT_TYPES) return errors.contentTypes
        return null
    }

    return (
        <section className="onboarding-page">
            <video
                className="onboarding-video-bg"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/videos/onboarding-bg.mp4" type="video/mp4" />
                <source src="/videos/onboarding-bg.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
            <div className="onboarding-container">
                <div className="onboarding-header">
                    <h1>Welcome! Let's personalize your experience</h1>
                    <div className="progress-indicator">
                        <div className="progress-step">
                            <div 
                                className={`step-number ${currentStep >= STEPS.ASSETS ? 'active' : ''} ${currentStep === STEPS.ASSETS ? 'current' : ''}`}
                                onClick={() => handleStepClick(STEPS.ASSETS)}
                                title="Go to step 1: Crypto Assets"
                            >
                                1
                            </div>
                            <span className="step-label">Assets</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div 
                                className={`step-number ${currentStep >= STEPS.INVESTOR_TYPE ? 'active' : ''} ${currentStep === STEPS.INVESTOR_TYPE ? 'current' : ''}`}
                                onClick={() => handleStepClick(STEPS.INVESTOR_TYPE)}
                                title="Go to step 2: Investor Type"
                            >
                                2
                            </div>
                            <span className="step-label">Investor Type</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div 
                                className={`step-number ${currentStep >= STEPS.CONTENT_TYPES ? 'active' : ''} ${currentStep === STEPS.CONTENT_TYPES ? 'current' : ''}`}
                                onClick={() => handleStepClick(STEPS.CONTENT_TYPES)}
                                title="Go to step 3: Content Types"
                            >
                                3
                            </div>
                            <span className="step-label">Content</span>
                        </div>
                    </div>
                </div>

                {errors.general && (
                    <div className="onboarding-error">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={(e) => {
                    e.preventDefault()
                    if (currentStep === STEPS.CONTENT_TYPES) {
                        handleFinish()
                    } else {
                        handleContinue()
                    }
                }} className="onboarding-form">
                    <div className="form-question">
                        <label className="question-label">
                            {getStepTitle()}
                            <span className="required">*</span>
                        </label>
                        {getStepHint() && (
                            <p className="question-hint">{getStepHint()}</p>
                        )}
                        {renderStepContent()}
                        {getCurrentStepError() && (
                            <span className="field-error">{getCurrentStepError()}</span>
                        )}
                    </div>

                    <div className="form-actions">
                        {currentStep > STEPS.ASSETS && (
                            <button
                                type="button"
                                className="btn-back"
                                onClick={handleBack}
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                        )}
                        {currentStep < STEPS.CONTENT_TYPES ? (
                            <button
                                type="submit"
                                className="btn-continue"
                                disabled={isSubmitting}
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn-finish"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Finish'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
            {showLoader && <Loader />}
        </section>
    )
}
