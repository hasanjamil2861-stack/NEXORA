import { useEffect, useState } from "react"

export default function LoadingScreen() {
    const [isVisible, setIsVisible] =
        useState(true)

    useEffect(() => {
     const timer = window.setTimeout(() => {
    setIsVisible(false)
}, 5500)

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

                    <div className="nexora-logo-ring">
                        <div className="nexora-logo-inner">
                            <span className="nexora-logo-letter">
                                N
                            </span>
                        </div>
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