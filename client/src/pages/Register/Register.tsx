import {
    useState,
    type FormEvent,
} from "react"

import {
    User,
    Mail,
    LockKeyhole,
    ArrowRight,
    Sparkles,
    Eye,
    EyeOff,
    CircleAlert,
    UserPlus,
} from "lucide-react"

import {
    useNavigate,
    Link,
} from "react-router-dom"

import { useAuth } from "../../context/AuthContext"
import "../../assets/styles/Register.css"

export default function Register() {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] =
        useState("")

    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const [showPassword, setShowPassword] =
        useState(false)

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false)

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        setError("")

        const cleanName = name.trim()
        const cleanEmail = email.trim()

        if (!cleanName) {
            setError("Full name is required.")
            return
        }

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

        if (!password) {
            setError("Password is required.")
            return
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            )
            return
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            )
            return
        }

        setIsSubmitting(true)

        const success = await register(
            cleanName,
            cleanEmail,
            password
        )

        if (success) {
            navigate("/login", {
                state: {
                    message:
                        "Account created successfully. You can now sign in.",
                },
            })

            return
        }

        setError(
            "Unable to create account. The email may already be registered."
        )

        setIsSubmitting(false)
    }

    return (
        <main className="register-page">
            {/* Background */}
            <div
                className="register-background"
                aria-hidden="true"
            >
                <div className="register-grid" />

                <div className="register-orb register-orb-one" />
                <div className="register-orb register-orb-two" />
                <div className="register-orb register-orb-three" />

                <div className="register-light register-light-one" />
                <div className="register-light register-light-two" />

                <div className="register-logo-background">
                    <img
                        src="/images/Logo.jpg"
                        alt=""
                    />
                </div>

                <div className="register-logo-overlay" />
            </div>

            <div className="register-container">
                {/* Brand */}
                <div className="register-brand">
                    <div className="register-brand-mark">
                        <img
                            src="/images/Logo.jpg"
                            alt="NEXORA Logo"
                        />
                    </div>

                    <div className="register-brand-text">
                        <strong>NEXORA</strong>
                        <span>
                            Business Management
                        </span>
                    </div>
                </div>

                {/* Register Card */}
                <section className="register-card">
                    <div className="register-card-top-line" />
                    <div className="register-card-glow" />

                    <div className="register-header">
                        <div className="register-badge">
                            <Sparkles size={14} />
                            <span>
                                Join NEXORA
                            </span>
                        </div>

                        <h1>Create Account</h1>

                        <p>
                            Create your NEXORA workspace
                            account and get started.
                        </p>
                    </div>

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/* Name */}
                        <div className="register-field">
                            <label htmlFor="register-name">
                                Full Name
                            </label>

                            <div className="register-input-wrapper">
                                <User
                                    className="register-input-icon"
                                    size={19}
                                />

                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(event) => {
                                        setName(
                                            event.target.value
                                        )

                                        if (error) {
                                            setError("")
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="register-field">
                            <label htmlFor="register-email">
                                Email Address
                            </label>

                            <div className="register-input-wrapper">
                                <Mail
                                    className="register-input-icon"
                                    size={19}
                                />

                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(
                                            event.target.value
                                        )

                                        if (error) {
                                            setError("")
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="register-field">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="register-input-wrapper">
                                <LockKeyhole
                                    className="register-input-icon"
                                    size={19}
                                />

                                <input
                                    id="register-password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(
                                            event.target.value
                                        )

                                        if (error) {
                                            setError("")
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
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
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="register-field">
                            <label htmlFor="register-confirm-password">
                                Confirm Password
                            </label>

                            <div className="register-input-wrapper">
                                <LockKeyhole
                                    className="register-input-icon"
                                    size={19}
                                />

                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(event) => {
                                        setConfirmPassword(
                                            event.target.value
                                        )

                                        if (error) {
                                            setError("")
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
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
                                className="register-error"
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
                            className="register-submit-btn"
                            disabled={
                                isSubmitting
                            }
                        >
                            <span>
                                {isSubmitting
                                    ? "Creating account..."
                                    : "Create Account"}
                            </span>

                            <ArrowRight size={19} />
                        </button>
                    </form>

                    {/* Employee Access */}
                    <div className="register-security">
                        <div className="register-security-icon">
                            <UserPlus size={18} />
                        </div>

                        <div className="register-security-content">
                            <strong>
                                Employee Account
                            </strong>

                            <span>
                                New accounts receive
                                Employee access.
                            </span>
                        </div>

                        <span className="register-security-status">
                            Employee
                        </span>
                    </div>

                    {/* Login Link */}
                    <div className="register-login-link">
                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign In
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="register-footer">
                    <span>
                        © 2026 NEXORA
                    </span>

                    <span className="register-footer-divider" />

                    <span>
                        Business Management System
                    </span>
                </footer>
            </div>
        </main>
    )
}