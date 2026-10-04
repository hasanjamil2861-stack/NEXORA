import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"

type User = {
  id: string
  name: string
  email: string
  role: "Admin" | "Employee"
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (
    email: string,
    password: string
  ) => Promise<boolean>
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>
  logout: () => void
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined)

const API_URL =
  "https://nexora-3-v485.onrender.com"

const isValidUser = (
  value: unknown
): value is User => {
  if (!value || typeof value !== "object") {
    return false
  }

  const user = value as User

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    (user.role === "Admin" ||
      user.role === "Employee")
  )
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser =
      localStorage.getItem("nexora-user")

    if (!savedUser) {
      return null
    }

    try {
      const parsedUser = JSON.parse(savedUser)

      return isValidUser(parsedUser)
        ? parsedUser
        : null
    } catch {
      localStorage.removeItem("nexora-user")
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("nexora-token")
  })

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(
          "Login failed:",
          data.message
        )

        return false
      }

      if (
        !data.user ||
        !data.token ||
        !isValidUser(data.user)
      ) {
        return false
      }

      const loggedUser: User = data.user

      setUser(loggedUser)
      setToken(data.token)

      localStorage.setItem(
        "nexora-user",
        JSON.stringify(loggedUser)
      )

      localStorage.setItem(
        "nexora-token",
        data.token
      )

      return true
    } catch (error) {
      console.error(
        "Login error:",
        error
      )

      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(
          "Register failed:",
          data.message
        )

        return false
      }

      return true
    } catch (error) {
      console.error(
        "Register error:",
        error
      )

      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    localStorage.removeItem("nexora-user")
    localStorage.removeItem("nexora-token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated:
          user !== null &&
          token !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    )
  }

  return context
}