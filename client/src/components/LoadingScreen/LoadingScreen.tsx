import { useEffect, useState } from "react"

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setIsVisible(false)
        }, 6000)

        return () => {
            window.clearTimeout(timer)
        }
    }, [])

    if (!isVisible) {
        return null
    }

    return (
        <div className="nexora-loading-screen">
            <div className="nexora-loading-background">
                <div className="nexora-loading-glow nexora-loading-glow-one" />
                <div className="nexora-loading-glow nexora-loading-glow-two" />
            </div>

            <div className="nexora-loading-content">

                <div className="nexora-logo-loader">

                    <img 
                        src="/images/Logo.jpg" 
                        alt="Nexora Logo" 
                        className="nexora-logo-image" 
                    />

                    <div className="nexora-welcome-text">
                        WELCOME MR To
                    </div>

                    <div className="nexora-logo-word">
                        NEXORA
                    </div>

                </div>

                <div
                    className="nexora-loading-dots"
                    aria-label="Loading"
                >
                    <span />
                    <span />
                    <span />
                </div>

            </div>
        </div>
    )
}