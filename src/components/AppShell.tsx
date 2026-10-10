import type { ReactNode } from 'react'

export const APP_SCROLL_ID = 'app-scroll'

// Scrolluje sa tento kontajner, nie okno. Začína pod stavovým riadkom (safe area),
// takže pod ním nie je žiadny scrollujúci obsah a iOS 26 naň nekreslí rozmazaný "scroll edge" efekt.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 w-full bg-black flex justify-center pt-[env(safe-area-inset-top)]">
      <div
        id={APP_SCROLL_ID}
        className="w-full max-w-[430px] h-full overflow-y-auto overscroll-contain bg-bg text-text-primary"
      >
        {children}
      </div>
    </div>
  )
}

export default AppShell
