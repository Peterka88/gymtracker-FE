import { useNavigate } from "react-router-dom";
import WorkoutRow from "../../components/WorkoutRow.tsx";
import BottomNav from "../../components/BottomNav.tsx";
import {useEffect, useState} from "react";
import type {WorkoutSummary} from "../../types/WorkoutSummary.ts";
import {workoutApi} from "../../api/workoutApi.ts";
import WorkoutActivityCard from "../../components/WorkoutActivityCard.tsx";
import ListIcon from "../../components/icons/ListIcon.tsx";

function WorkoutsListPage() {

    const navigate = useNavigate();

    const PAGE_SIZE = 10

    const [workouts, setWorkouts] = useState<WorkoutSummary[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        workoutApi.getAll( 0, PAGE_SIZE).then((data) => {
            setWorkouts(data);
            setHasMore(data.length === PAGE_SIZE);
            setPage(0)
            setLoading(false)
        });
    }, [])

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
                <button className="flex items-center gap-1.5 h-10 px-4 rounded-2xl border border-white/10 bg-chip text-text-secondary text-[13.5px] font-bold cursor-pointer transition-all duration-150 hover:bg-white/6 active:scale-[0.97]"
                        onClick={() => navigate('/exercises')}>
                    <ListIcon size={15} />
                    Cviky
                </button>
            </div>

            <WorkoutActivityCard />

            {loading && (
                <div className="flex-1 flex items-center justify-center gap-1.5 py-6">
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" />
                </div>
            )}

            {!loading && workouts.length === 0 && (
                <div className="flex flex-1 justify-center items-center text-text-muted font-medium">
                    Zoznam tréningov je prázdny
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
                    workoutApi.getAll(page + 1, PAGE_SIZE).then((data) => {
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
