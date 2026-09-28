import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"

type ToastType = "success" | "error"

type ToastContextType = {
  showToast: (
    message: string,
    type?: ToastType
  ) => void
}

type ToastProviderProps = {
  children: ReactNode
}

const ToastContext =
  createContext<ToastContextType | undefined>(
    undefined
  )

export function ToastProvider({
  children,
}: ToastProviderProps) {
  const [message, setMessage] = useState("")
  const [type, setType] =
    useState<ToastType>("success")

  const timeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    )

  function showToast(
    newMessage: string,
    newType: ToastType = "success"
  ) {
    setMessage(newMessage)
    setType(newType)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {message && (
        <div className={`toast toast-${type}`}>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    )
  }

  return context
}