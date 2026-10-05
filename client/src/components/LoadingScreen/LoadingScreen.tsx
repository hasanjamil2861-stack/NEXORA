import { useEffect, useState } from "react"

type LoadingScreenProps = {
    isLoading: boolean
}

export default function LoadingScreen({
    isLoading,
}: LoadingScreenProps) {
    const [showLogo, setShowLogo] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        /*
         * Show the logo after the loading dots
         * have been visible for about 1 second.
         */
        const logoTimer = window.setTimeout(() => {
            setShowLogo(true)
        }, 1000)

        return () => {
            window.clearTimeout(logoTimer)
        }
    }, [])

    useEffect(() => {
        if (!isLoading) {
            /*
             * Small delay gives the application
             * a smooth transition instead of an
             * instant hard cut.
             */
            const hideTimer = window.setTimeout(() => {
                setIsVisible(false)
            }, 350)

            return () => {
                window.clearTimeout(hideTimer)
            }
        }
    }, [isLoading])

    if (!isVisible) {
        return null
    }

    return (
        <div
            className={`nexora-loading-screen ${
                !isLoading
                    ? "nexora-loading-screen-exit"
                    : ""
            }`}
        >
            <div className="nexora-loading-background">
                <div className="nexora-loading-glow nexora-loading-glow-one" />
                <div className="nexora-loading-glow nexora-loading-glow-two" />
            </div>

            <div className="nexora-loading-content">

                {/* Loading Dots */}
                <div
                    className="nexora-loading-dots"
                    aria-label="Loading"
                >
                    <span />
                    <span />
                    <span />
                </div>

                {/* Logo appears after 1 second */}
                {showLogo && (
                    <div className="nexora-logo-loader">

                        <img
                            src="/images/Logo.jpg"
                            alt="Nexora Logo"
                            className="nexora-logo-image"
                        />

                        <div className="nexora-welcome-text">
                            WELCOME MR TO
                        </div>

                        <div className="nexora-logo-word">
                            NEXORA
                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}