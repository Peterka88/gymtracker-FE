import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import CheckIcon from '../components/icons/CheckIcon.tsx'
import XCircleIcon from '../components/icons/XCircleIcon.tsx'
import InfoCircleIcon from '../components/icons/InfoCircleIcon.tsx'

type ToastType = 'error' | 'success' | 'info'

interface Toast {
    id: number
    message: string
    type: ToastType
    leaving: boolean
}

const TOAST_EXIT_DURATION = 250

const toastStyles: Record<ToastType, string> = {
    error: 'border-red-500/30 text-red-400',
    success: 'border-accent/30 text-accent',
    info: 'border-protein/30 text-protein'
}

const toastIcons: Record<ToastType, ReactNode> = {
    error: <XCircleIcon size={16} />,
    success: <CheckIcon size={16} />,
    info: <InfoCircleIcon size={16} />
}

interface ToastContextValue {
    showError: (message: string) => void
    showSuccess: (message: string) => void
    showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let notifyErrorRef: ((message: string) => void) | null = null

export function notifyError(message: string) {
    notifyErrorRef?.(message)
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message, type, leaving: false }])
        setTimeout(() => {
            setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)))
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id))
            }, TOAST_EXIT_DURATION)
        }, 4000)
    }, [])

    const showError = useCallback((message: string) => showToast(message, 'error'), [showToast])
    const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast])
    const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast])

    useEffect(() => {
        notifyErrorRef = showError
        return () => {
            notifyErrorRef = null
        }
    }, [showError])

    return (
        <ToastContext.Provider value={{ showError, showSuccess, showInfo }}>
            {children}
            <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 px-5 z-50 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto max-w-sm w-full bg-card border ${toastStyles[toast.type]} rounded-2xl px-4 py-3 text-[13px] font-semibold shadow-lg flex items-center gap-2 ${toast.leaving ? 'animate-toast-out' : 'animate-toast-in'}`}
                    >
                        <span className="shrink-0">{toastIcons[toast.type]}</span>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return ctx
}