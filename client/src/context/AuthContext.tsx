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
        "https://nexora-4-hit8.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      if (!response.ok) {
        return false
      }

      const data = await response.json()

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

  // Register a new Employee account
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        "https://nexora-4-hit8.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

      return response.ok
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