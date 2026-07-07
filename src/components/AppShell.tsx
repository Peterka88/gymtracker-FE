import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-bg text-text-primary">
        {children}
      </div>
    </div>
  )
}

export default AppShell