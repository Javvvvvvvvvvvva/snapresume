import * as React from "react"
import { cn } from "../../lib/utils"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"

export interface ToastProps {
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  onClose?: () => void
  duration?: number
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
}

export function Toast({ type, title, message, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const Icon = toastIcons[type]

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out",
        toastStyles[type]
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
