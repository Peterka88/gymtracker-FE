import { useNavigate } from "react-router-dom";
import WorkoutRow from "../../components/WorkoutRow.tsx";
import BottomNav from "../../components/BottomNav.tsx";
import {useEffect, useRef, useState} from "react";
import type {WorkoutSummary} from "../../types/WorkoutSummary.ts";
import {workoutApi} from "../../api/workoutApi.ts";
import WorkoutActivityCard from "../../components/WorkoutActivityCard.tsx";
import ListIcon from "../../components/icons/ListIcon.tsx";
import type {WorkoutSessionsStats} from "../../types/WorkoutSessionsStats.ts";
import {monthKey, shortMonthLabel} from "../../utils/formatDateTime.ts";

function recordsLabel(count: number) {
    if (count === 1) return '1 záznam'
    if (count >= 2 && count <= 4) return `${count} záznamy`
    return `${count} záznamov`
}

function WorkoutsListPage() {

    const navigate = useNavigate();

    const PAGE_SIZE = 10

    const [workouts, setWorkouts] = useState<WorkoutSummary[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)

    const [stats, setStats] = useState<WorkoutSessionsStats | null>(null)

    useEffect(() => {
        workoutApi.getStats().then(setStats)
    }, [])

    useEffect(() => {
        workoutApi.getAll( 0, PAGE_SIZE).then((data) => {
            setWorkouts(data);
            setHasMore(data.length === PAGE_SIZE);
            setPage(0)
            setLoading(false)
        });
    }, [])

    const cardRef = useRef<HTMLDivElement>(null)

    const now = new Date()
    const [selectedMonth, setSelectedMonth] = useState({ year: now.getFullYear(), month: now.getMonth() })

    // počas programového scrollu (klik na šípky v kalendári) ignorujeme scroll->kalendár synchronizáciu
    const programmaticScroll = useRef(false)
    const releaseTimer = useRef<number | undefined>(undefined)

    const holdScrollSync = () => {
        programmaticScroll.current = true
        window.clearTimeout(releaseTimer.current)
        releaseTimer.current = window.setTimeout(() => { programmaticScroll.current = false }, 150)
    }

    const handleMonthChange = (year: number, month: number) => {
        setSelectedMonth({ year, month })
        const target = document.getElementById(`month-${monthKey(year, month)}`)
        if (!target) return
        holdScrollSync()
        const cardHeight = cardRef.current?.offsetHeight ?? 0
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - cardHeight - 10,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        let frame = 0

        const syncCalendarWithScroll = () => {
            if (programmaticScroll.current) {
                holdScrollSync()
                return
            }
            const threshold = (cardRef.current?.offsetHeight ?? 0) + 8
            let activeKey: string | null = null
            for (const el of document.querySelectorAll<HTMLElement>('[data-month-group]')) {
                if (el.getBoundingClientRect().top <= threshold) activeKey = el.dataset.monthGroup!
                else break
            }
            if (!activeKey) return
            const [year, month] = activeKey.split('-').map(Number)
            setSelectedMonth((prev) =>
                prev.year === year && prev.month === month - 1 ? prev : { year, month: month - 1 }
            )
        }

        const onScroll = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(syncCalendarWithScroll)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            cancelAnimationFrame(frame)
        }
    }, [])

    type MonthGroup = { key: string; month: string; items: (typeof workouts[number] & { index: number })[] }

    const loadedGroups = workouts.reduce<MonthGroup[]>(
        (groups, workout, index) => {
            const item = { ...workout, index }
            const lastGroup = groups[groups.length - 1]
            if (lastGroup && lastGroup.key === workout.monthKey) {
                lastGroup.items.push(item)
            } else {
                groups.push({ key: workout.monthKey, month: workout.month, items: [item] })
            }
            return groups
        },
        []
    )

    // aktuálny mesiac sa zobrazí v zozname aj bez tréningov, aby mal hlavičku (a dalo sa naň scrollovať)
    const currentMonthKey = monthKey(now.getFullYear(), now.getMonth())
    const monthGroups: MonthGroup[] = !loading && loadedGroups[0]?.key !== currentMonthKey
        ? [{ key: currentMonthKey, month: shortMonthLabel(now.getMonth()), items: [] }, ...loadedGroups]
        : loadedGroups

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between px-[22px] pt-1.5 pb-2">
                <div>
                    <div className="text-[26px] font-extrabold">Tréningy</div>
                    <div className="text-text-muted text-[12.5px] mt-0.5">{stats ? recordsLabel(stats.workoutsThisYear) : '–'} · tento rok</div>
                </div>
                <button className="flex items-center gap-1.5 h-10 px-4 rounded-2xl border border-white/10 bg-chip text-text-secondary text-[13.5px] font-bold cursor-pointer transition-all duration-150 hover:bg-white/6 active:scale-[0.97]"
                        onClick={() => navigate('/exercises')}>
                    <ListIcon size={15} />
                    Cviky
                </button>
            </div>

            <div ref={cardRef} className="sticky top-0 z-10 bg-bg pb-2">
                <WorkoutActivityCard
                    stats={stats}
                    year={selectedMonth.year}
                    month={selectedMonth.month}
                    onMonthChange={handleMonthChange}
                />
            </div>

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
                <div key={group.key} id={`month-${group.key}`} data-month-group={group.key}>
                    <div className="px-[22px] pt-6 pb-1.5">
                        <span className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase">{group.month}</span>
                    </div>
                    <div className="px-5">
                        {group.items.length === 0 && (
                            <div className="px-1 py-3 text-text-muted text-[12.5px]">Tento mesiac zatiaľ žiadny tréning</div>
                        )}
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
