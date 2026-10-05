import { useEffect, useState } from "react"

export default function LoadingScreen() {
    // Check if the loading screen has already been shown in this session
    const [isVisible, setIsVisible] = useState(() => {
        const hasSeenLoading = sessionStorage.getItem("nexora_has_seen_loading")
        return !hasSeenLoading
    })

    useEffect(() => {
        if (!isVisible) return

        // Mark as seen immediately so refreshing won't trigger it again
        sessionStorage.setItem("nexora_has_seen_loading", "true")

        const timer = window.setTimeout(() => {
            setIsVisible(false)
        }, 6000)

        return () => {
            window.clearTimeout(timer)
        }
    }, [isVisible])

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
                        WELCOME MR
                    </div>

                    <div className="nexora-logo-word">
                        NEXORA
                    </div>

                    <div className="nexora-arabic-quote">
                        شو مفكر بتفرق معي؟
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