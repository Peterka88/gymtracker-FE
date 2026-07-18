import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface Toast {
    id: number
    message: string
}

interface ToastContextValue {
    showError: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let notifyErrorRef: ((message: string) => void) | null = null

export function notifyError(message: string) {
    notifyErrorRef?.(message)
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showError = useCallback((message: string) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 4000)
    }, [])

    useEffect(() => {
        notifyErrorRef = showError
        return () => {
            notifyErrorRef = null
        }
    }, [showError])

    return (
        <ToastContext.Provider value={{ showError }}>
            {children}
            <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 px-5 z-50 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto max-w-sm w-full bg-card border border-red-500/30 rounded-2xl px-4 py-3 text-[13px] font-semibold text-red-400 shadow-lg"
                    >
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