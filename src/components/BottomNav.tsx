import { NavLink, useNavigate } from "react-router-dom"
import { useState, type ReactNode } from "react"
import ClockIcon from "./icons/ClockIcon.tsx"

function HomeIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11l8-7 8 7" />
            <path d="M6 10v9h12v-9" />
        </svg>
    )
}

// function DiaryIcon() {
//     return (
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//             <line x1="6" y1="8" x2="18" y2="8" />
//             <line x1="6" y1="12" x2="18" y2="12" />
//             <line x1="6" y1="16" x2="14" y2="16" />
//         </svg>
//     )
// }

function WorkoutIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 9v6" />
            <path d="M7 7v10" />
            <path d="M17 7v10" />
            <path d="M20 9v6" />
            <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
    )
}

// function StatsIcon() {
//     return (
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//             <line x1="6" y1="20" x2="6" y2="13" />
//             <line x1="12" y1="20" x2="12" y2="6" />
//             <line x1="18" y1="20" x2="18" y2="10" />
//         </svg>
//     )
// }

function CameraIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3z" />
            <circle cx="12" cy="13" r="3.2" />
        </svg>
    )
}

function NavTab({ to, label, children }: { to: string; label: string; children: ReactNode }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center gap-1 w-[50px] ${isActive ? 'text-accent font-bold' : 'text-text-faint font-semibold'}`
            }
        >
            {children}
            <span className="text-[10px]">{label}</span>
        </NavLink>
    )
}

function AddSheetOption({
    icon,
    iconBg,
    iconColor,
    title,
    subtitle,
    onClick,
}: {
    icon: ReactNode
    iconBg: string
    iconColor: string
    title: string
    subtitle: string
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3.5 p-4 bg-track border border-white/[0.07] rounded-2xl cursor-pointer text-left"
        >
            <div className={`w-[46px] h-[46px] rounded-2xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-[15px] font-extrabold text-text-primary">{title}</div>
                <div className="text-text-muted text-[12.5px] mt-0.5">{subtitle}</div>
            </div>
            <span className="text-text-faint text-xl">›</span>
        </button>
    )
}

function BottomNav() {

    const navigate = useNavigate();
    const [sheetOpen, setSheetOpen] = useState(false);

    function goToNewWorkout() {
        setSheetOpen(false);
        navigate('/workouts/new');
    }

    return (
        <>
            <div
                onClick={() => setSheetOpen(false)}
                className={`fixed inset-0 bg-black/55 z-30 transition-opacity duration-200 ${
                    sheetOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            />

            <div
                className={`fixed left-0 right-0 bottom-0 max-w-[430px] mx-auto z-40 bg-chip border-t border-white/8 rounded-t-[28px] px-5 pt-2.5 pb-8 transition-transform duration-300 ease-out ${
                    sheetOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="flex justify-center pb-4">
                    <div className="w-10 h-1.5 rounded-full bg-white/20" />
                </div>
                <div className="text-[17px] font-extrabold px-1">Čo chceš pridať?</div>
                <div className="text-text-muted text-[13px] px-1 mt-0.5 mb-4">Rýchly záznam do denníka</div>

                <div className="flex flex-col gap-2.5">
                    <AddSheetOption
                        icon={<WorkoutIcon />}
                        iconBg="bg-accent/14"
                        iconColor="text-accent"
                        title="Pridať tréning"
                        subtitle="Začať alebo zapísať tréning"
                        onClick={goToNewWorkout}
                    />
                    <AddSheetOption
                        icon={<CameraIcon />}
                        iconBg="bg-protein/16"
                        iconColor="text-protein"
                        title="Pridať jedlo"
                        subtitle="Odfoť jedlo a nechaj to na AI"
                        onClick={() => setSheetOpen(false)}
                    />
                    <AddSheetOption
                        icon={<ClockIcon />}
                        iconBg="bg-fat/16"
                        iconColor="text-fat"
                        title="Zaznamenať váhu"
                        subtitle="Zapíš dnešnú telesnú hmotnosť"
                        onClick={() => setSheetOpen(false)}
                    />
                </div>

                <button
                    onClick={() => setSheetOpen(false)}
                    className="w-full mt-3.5 py-3.5 rounded-2xl border border-white/10 text-text-secondary text-[14px] font-bold cursor-pointer"
                >
                    Zrušiť
                </button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-20">
                <div className="relative flex items-end px-[10px] pt-3.5 pb-2 bg-nav border-t border-white/[0.06]">
                    <div className="flex-1 flex justify-around">
                        <NavTab to="/dashboard" label="Domov">
                            <HomeIcon />
                        </NavTab>
                        {/*<NavTab to="/diary" label="Denník">*/}
                        {/*    <DiaryIcon />*/}
                        {/*</NavTab>*/}
                    </div>

                    <div className="w-14 shrink-0" />

                    <div className="flex-1 flex justify-around">
                        <NavTab to="/workouts" label="Tréning">
                            <WorkoutIcon />
                        </NavTab>
                        {/*<NavTab to="/stats" label="Štatistiky">*/}
                        {/*    <StatsIcon />*/}
                        {/*</NavTab>*/}
                    </div>

                    <button
                        onClick={() => setSheetOpen((v) => !v)}
                        className={`absolute left-1/2 -translate-x-1/2 -top-5 w-[54px] h-[54px] rounded-full bg-accent text-on-accent flex items-center justify-center text-2xl shadow-[0_8px_22px_-4px_rgba(34,197,94,0.55)] transition-all duration-200 hover:brightness-110 active:scale-[0.95] cursor-pointer ${
                            sheetOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                    >
                        +
                    </button>
                </div>
            </div>
        </>
    )
}

export default BottomNav
