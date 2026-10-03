import {
    useState,
    type FormEvent,
} from "react"

import {
    Mail,
    LockKeyhole,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Eye,
    EyeOff,
    CircleAlert,
} from "lucide-react"

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom"

import { useAuth } from "../../context/AuthContext"
import "../../assets/styles/Login.css"

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()

    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] =
        useState(false)
    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const successMessage =
        location.state?.message || ""

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        setError("")

        const cleanEmail = email.trim()
        const enteredPassword = password

        if (!cleanEmail) {
            setError("Email is required.")
            return
        }

        if (!cleanEmail.includes("@")) {
            setError(
                "Please enter a valid email address."
            )
            return
        }

        if (!enteredPassword) {
            setError("Password is required.")
            return
        }

        setIsSubmitting(true)

        try {
            const success = await login(
                cleanEmail,
                enteredPassword
            )

            if (success) {
                setEmail("")
                setPassword("")
                setShowPassword(false)

                navigate("/", {
                    replace: true,
                })

                return
            }

            setError(
                "Invalid email or password."
            )
        } catch (error) {
            console.error(
                "LOGIN SUBMIT ERROR:",
                error
            )

            setError(
                "Unable to connect to the server."
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="login-page">
            {/* Background */}
            <div
                className="login-background"
                aria-hidden="true"
            >
                <div className="login-grid" />

                <div className="login-orb login-orb-one" />
                <div className="login-orb login-orb-two" />
                <div className="login-orb login-orb-three" />

                <div className="login-light login-light-one" />
                <div className="login-light login-light-two" />

                <div className="login-logo-background">
                    <img
                        src="/images/Logo.jpg"
                        alt=""
                    />
                </div>

                <div className="login-logo-overlay" />
            </div>

            <div className="login-container">
                {/* Brand */}
                <div className="login-brand">
                    <div className="login-brand-mark">
                        <img
                            src="/images/Logo.jpg"
                            alt="NEXORA Logo"
                        />
                    </div>

                    <div className="login-brand-text">
                        <strong>NEXORA</strong>

                        <span>
                            Business Management
                        </span>
                    </div>
                </div>

                {/* Login Card */}
                <section className="login-card">
                    <div className="login-card-top-line" />
                    <div className="login-card-glow" />

                    <div className="login-header">
                        <div className="login-badge">
                            <Sparkles size={14} />

                            <span>
                                Secure Workspace
                            </span>
                        </div>

                        <h1>
                            Welcome Back
                        </h1>

                        <p>
                            Sign in to your NEXORA
                            business management
                            workspace.
                        </p>
                    </div>

                    {/* Registration Success */}
                    {successMessage && (
                        <div
                            className="login-success"
                            role="status"
                        >
                            <span>
                                {successMessage}
                            </span>
                        </div>
                    )}

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/* Email */}
                        <div className="login-field">
                            <label htmlFor="login-email">
                                Email Address
                            </label>

                            <div className="login-input-wrapper">
                                <Mail
                                    className="login-input-icon"
                                    size={19}
                                />

                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="admin@nexora.com"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(
                                            event.target.value
                                        )

                                        if (error) {
                                            setError("")
                                        }
                                    }}
                                    disabled={
                                        isSubmitting
                                    }
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="login-field">
                            <div className="login-label-row">
                                <label htmlFor="login-password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="login-forgot-btn"
                                    onClick={() =>
                                        setError(
                                            "Password recovery will be connected later."
                                        )
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="login-input-wrapper">
                                <LockKeyhole
                                    className="login-input-icon"
                                    size={19}
                                />

                                <input
                                    id="login-password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(
                                            event.target.value
                                        )

                                        if (error) {
                                            setError("")
                                        }
                                    }}
                                    disabled={
                                        isSubmitting
                                    }
                                />

                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onClick={() =>
                                        setShowPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="login-error"
                                role="alert"
                            >
                                <CircleAlert size={18} />

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={
                                isSubmitting
                            }
                        >
                            <span>
                                {isSubmitting
                                    ? "Signing in..."
                                    : "Sign In"}
                            </span>

                            <ArrowRight size={19} />
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="login-register-link">
                        <span>
                            Don't have an account?
                        </span>

                        <Link
                            to="/register"
                            className={
                                isSubmitting
                                    ? "disabled"
                                    : undefined
                            }
                        >
                            Create one
                        </Link>
                    </div>

                    {/* Security */}
                    <div className="login-security">
                        <div className="login-security-icon">
                            <ShieldCheck size={18} />
                        </div>

                        <div className="login-security-content">
                            <strong>
                                Secure Access
                            </strong>

                            <span>
                                Your NEXORA workspace
                                is protected.
                            </span>
                        </div>

                        <span className="login-security-status">
                            Secure
                        </span>
                    </div>
                </section>

                {/* Footer */}
                <footer className="login-footer">
                    <span>
                        © 2026 NEXORA
                    </span>

                    <span className="login-footer-divider" />

                    <span>
                        Business Management System
                    </span>
                </footer>
            </div>
        </main>
    )
}