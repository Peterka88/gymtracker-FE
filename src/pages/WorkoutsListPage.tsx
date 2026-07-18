import { useNavigate } from "react-router-dom";
import WorkoutRow from "../components/WorkoutRow.tsx";
import BottomNav from "../components/BottomNav";
import {useEffect, useState} from "react";
import type {WorkoutSummary} from "../types/WorkoutSummary.ts";
import {workoutApi} from "../api/workoutApi.ts";
import BarbellIcon from "../components/icons/BarbellIcon.tsx";

function WorkoutsListPage() {

    const navigate = useNavigate();

    const PAGE_SIZE = 10

    const [workouts, setWorkouts] = useState<WorkoutSummary[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        workoutApi.getAll(1, 0, PAGE_SIZE).then((data) => {
            setWorkouts(data);
            setHasMore(data.length === PAGE_SIZE);
            setPage(0)
            setLoading(false)
        });
    }, [])

    const stats = {
        thisWeek: 4,
        hoursInGym: '6,2',
        streakDays: 12,
    }

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
                <button className="w-10 h-10 rounded-2xl bg-accent text-on-accent flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.95]"
                        onClick={() => navigate('/workouts/new')}>
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
                    <BarbellIcon />
                </div>
                <div className="flex-1">
                    <div className="text-[14px] font-bold">Zoznam cvikov</div>
                    <div className="text-text-muted text-xs mt-0.5">Progres a rekordy podľa cviku</div>
                </div>
                <span className="text-text-faint text-lg">›</span>
            </div>

            {loading && (
                <div className="flex-1 flex items-center justify-center gap-1.5 py-6">
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" />
                </div>
            )}

            {monthGroups.map((group) => (
                <div key={group.month}>
                    <div className="px-[22px] pt-6 pb-1.5">
                        <span className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase">{group.month}</span>
                    </div>
                    <div className="px-5">
                        {group.items.map((workout) => (
                            <WorkoutRow
                                id={workout.id}
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

            {hasMore && !loading &&(
                <button className="mx-5 mt-4 p-4 bg-card border border-white/[0.07] font-bold rounded-2xl text-center cursor-pointer hover:bg-card-hover transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
                onClick={() => {
                    workoutApi.getAll(1, page + 1, PAGE_SIZE).then((data) => {
                        setWorkouts([...workouts, ...data]);
                        setHasMore(data.length === PAGE_SIZE);
                        setPage(page + 1);
                    });
                }}>
                Načítať dalšie
            </button>
            )}

            <BottomNav />
        </div>
    )
}

export default WorkoutsListPage;
