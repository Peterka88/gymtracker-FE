import { useNavigate } from "react-router-dom";
import WorkoutRow from "../components/WorkoutRow.tsx";
import BottomNav from "../components/BottomNav";

function DumbbellIcon() {
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

function WorkoutsListPage() {

    const navigate = useNavigate();

    const stats = {
        thisWeek: 4,
        hoursInGym: '6,2',
        streakDays: 12,
    }

    const workouts = [
        { date: '27', month: 'JÚN', name: 'Push deň', pr: true, meta: 'Dnes · 6 cvikov · 48 min · 4 250 kg' },
        { date: '25', month: 'JÚN', name: 'Pull deň', pr: false, meta: 'Pred 2 dňami · 5 cvikov · 52 min · 5 100 kg' },
        { date: '23', month: 'JÚN', name: 'Deň nôh', pr: true, meta: 'Pred 4 dňami · 6 cvikov · 61 min · 8 400 kg' },
        { date: '21', month: 'JÚN', name: 'Push deň', pr: false, meta: 'Pred 6 dňami · 6 cvikov · 46 min · 4 050 kg' },
        { date: '19', month: 'JÚN', name: 'Pull deň', pr: false, meta: '19. jún · 5 cvikov · 49 min · 4 980 kg' },
        { date: '17', month: 'JÚN', name: 'Deň nôh', pr: false, meta: '17. jún · 6 cvikov · 58 min · 8 100 kg' },
        { date: '28', month: 'MÁJ', name: 'Push deň', pr: false, meta: '28. máj · 6 cvikov · 45 min · 4 100 kg' },
        { date: '25', month: 'MÁJ', name: 'Pull deň', pr: false, meta: '25. máj · 5 cvikov · 50 min · 4 900 kg' },
    ]

    // zoskupí po sebe idúce záznamy z rovnakého mesiaca a zachová im globálny index (kvôli zvýrazneniu prvého riadku)
    const monthGroups = workouts.reduce<{ month: string; items: (typeof workouts[number] & { index: number })[] }[]>(
        (groups, workout, index) => {
            const item = { ...workout, index }
            const lastGroup = groups[groups.length - 1]
            if (lastGroup && lastGroup.month === workout.month) {
                lastGroup.items.push(item)
            } else {
                groups.push({ month: workout.month, items: [item] })
            }
            return groups
        },
        []
    )

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between px-[22px] pt-1.5 pb-2">
                <div>
                    <div className="text-[26px] font-extrabold">Tréningy</div>
                    <div className="text-text-muted text-[12.5px] mt-0.5">42 záznamov · tento rok</div>
                </div>
                <button className="w-10 h-10 rounded-2xl bg-accent text-on-accent flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.95]">
                    +
                </button>
            </div>

            <div className="flex gap-2.5 px-5 pt-2">
                <div className="flex-1 p-3 bg-card border border-white/[0.07] rounded-2xl text-center">
                    <div className="text-[18px] font-extrabold">{stats.thisWeek}</div>
                    <div className="text-text-muted text-[10.5px] mt-0.5">tento týždeň</div>
                </div>
                <div className="flex-1 p-3 bg-card border border-white/[0.07] rounded-2xl text-center">
                    <div className="text-[18px] font-extrabold">
                        {stats.hoursInGym} <span className="text-text-muted text-[11px] font-semibold">h</span>
                    </div>
                    <div className="text-text-muted text-[10.5px] mt-0.5">čas v posilke</div>
                </div>
                <div className="flex-1 p-3 bg-card border border-white/[0.07] rounded-2xl text-center">
                    <div className="text-[18px] font-extrabold">🔥 {stats.streakDays}</div>
                    <div className="text-text-muted text-[10.5px] mt-0.5">dní v sérii</div>
                </div>
            </div>

            <div
                onClick={() => navigate('/exercises')}
                className="mx-5 mt-4 p-4 bg-card border border-white/[0.07] rounded-2xl flex items-center gap-[13px] cursor-pointer"
            >
                <div className="w-[42px] h-[42px] rounded-xl bg-accent/[0.14] flex items-center justify-center text-accent shrink-0">
                    <DumbbellIcon />
                </div>
                <div className="flex-1">
                    <div className="text-[14px] font-bold">Zoznam cvikov</div>
                    <div className="text-text-muted text-xs mt-0.5">Progres a rekordy podľa cviku</div>
                </div>
                <span className="text-text-faint text-lg">›</span>
            </div>

            {monthGroups.map((group) => (
                <div key={group.month}>
                    <div className="px-[22px] pt-6 pb-1.5">
                        <span className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase">{group.month}</span>
                    </div>
                    <div className="px-5">
                        {group.items.map((workout) => (
                            <WorkoutRow
                                id={workout.index}
                                key={workout.date + workout.name}
                                name={workout.name}
                                date={workout.date}
                                month={workout.month}
                                pr={workout.pr}
                                meta={workout.meta}
                                index={workout.index}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <BottomNav />
        </div>
    )
}

export default WorkoutsListPage;
