import { useState, type SubmitEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8A92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8A92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6,20.5H42V20H24v8h11.3c-1.6,4.7-6.1,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.9,1.2,8,3.1l5.7-5.7C34.6,6.5,29.6,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-8.9,20-20C44,22.7,43.9,21.6,43.6,20.5z" />
      <path fill="#FF3D00" d="M6.3,14.7l6.6,4.8C14.7,15.1,19,12,24,12c3.1,0,5.9,1.2,8,3.1l5.7-5.7C34.6,6.5,29.6,4,24,4C16.3,4,9.7,8.3,6.3,14.7z" />
      <path fill="#4CAF50" d="M24,44c5.5,0,10.5-2.1,14.3-5.6l-6.6-5.6C29.6,34.7,26.9,36,24,36c-5.2,0-9.6-3.3-11.3-7.9l-6.5,5C9.5,39.6,16.2,44,24,44z" />
      <path fill="#1976D2" d="M43.6,20.5H42V20H24v8h11.3c-0.8,2.3-2.3,4.3-4.2,5.7c0,0,0,0,0,0l6.6,5.6C39.6,38,44,32.5,44,24C44,22.7,43.9,21.6,43.6,20.5z" />
    </svg>
  )
}

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await authApi.login(username, password)
      navigate('/dashboard')
    } catch {
      setError('Nesprávny username alebo heslo')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center pt-11 px-8">
        <div className="w-[72px] h-[72px] rounded-[22px] bg-card border border-white/[0.07] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-accent" />
        </div>
        <h1 className="text-[25px] font-extrabold mt-5 tracking-tight">GymTracker</h1>
        <p className="text-text-muted text-[13.5px] mt-1.5 text-center">
          Tréningy a kalórie na jednom mieste
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-7 pt-[34px] flex flex-col gap-4">
        <div>
          <div className="text-text-muted text-[11.5px] font-bold mb-2 pl-0.5">Username</div>
          <div className="flex items-center gap-[11px] bg-chip border border-white/[0.08] rounded-[14px] px-4 py-3.5">
            <UserIcon />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[14.5px] text-text-primary placeholder:text-text-faint"
            />
          </div>
        </div>

        <div>
          <div className="text-text-muted text-[11.5px] font-bold mb-2 pl-0.5">Heslo</div>
          <div className="flex items-center gap-[11px] bg-chip border border-white/[0.08] rounded-[14px] px-4 py-3.5">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[14.5px] text-text-primary placeholder:text-text-faint tracking-[3px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-accent text-[12.5px] font-bold shrink-0 transition-opacity duration-150 hover:opacity-70 active:opacity-50"
            >
              {showPassword ? 'Skryť' : 'Zobraziť'}
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-text-muted text-[12.5px] font-semibold">Zabudnuté heslo?</span>
        </div>

        {error && (
          <p className="text-red-400 text-[12.5px] font-semibold text-center">{error}</p>
        )}

        <PrimaryButtonInline type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Prihlasujem...' : 'Prihlásiť sa'}
        </PrimaryButtonInline>
      </form>

      <div className="px-7">
        <div className="flex items-center gap-3 my-[22px]">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-text-faint text-xs">alebo</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        <div className="flex gap-2.5">
          <button className="flex-1 flex items-center justify-center gap-2 py-[13px] rounded-[14px] border border-white/10 bg-chip text-[13.5px] font-bold transition-all duration-150 hover:bg-white/6 active:scale-[0.97]">
            <GoogleIcon />
            Google
          </button>
        </div>
      </div>

      <div className="text-center py-[26px] pb-3.5 text-[13px] text-text-muted mt-auto">
        Nemáš účet? <span className="text-accent font-bold">Zaregistruj sa</span>
      </div>
    </div>
  )
}

function PrimaryButtonInline({
  children,
  type = 'button',
  disabled = false,
}: {
  children: ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full bg-accent text-on-accent rounded-2xl py-4 text-[15px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
    >
      {children}
    </button>
  )
}

export default Login
