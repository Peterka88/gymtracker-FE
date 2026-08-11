import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis} from "recharts";
import type {TooltipContentProps} from "recharts";
import TrashIcon from "../../components/icons/TrashIcon.tsx";
import PencilIcon from "../../components/icons/PencilIcon.tsx";
import WorkoutRow from "../../components/WorkoutRow.tsx";
import {formatShortDate} from "../../utils/formatDateTime.ts";
import {equipmentLabel, muscleGroupLabel, type ExerciseHistoryRow, type ExerciseStats, type ProgressData} from "../../types/Exercises.ts";
import {exerciseApi} from "../../api/exercisesApi.ts";
import {useToast} from "../../context/ToastContext.tsx";
import BottomNav from "../../components/BottomNav.tsx";
import ConfirmDialog from "../../components/ConfirmDialog.tsx";

type ProgressMetric = 'weight' | 'volume' | 'estimated1RM'

function ProgressDot({cx, cy, index, isLast}: { cx?: number; cy?: number; index?: number; isLast: boolean }) {
    return (
        <circle
            key={index}
            cx={cx}
            cy={cy}
            r={isLast ? 4 : 2.5}
            fill={isLast ? "var(--color-carbs)" : "var(--color-accent)"}
            stroke={isLast ? "var(--color-carbs)" : "var(--color-accent)"}
        />
    )
}

function ProgressTooltip({active, payload, metric}: TooltipContentProps & { metric: ProgressMetric }) {
    if (!active || !payload?.length) return null

    const point = payload[0].payload as ProgressData

    return (
        <div className="bg-btn border border-white/10 rounded-lg px-2.5 py-1.5 shadow-lg">
            <div className="text-text-muted text-[10px]">{formatShortDate(point.date)}</div>
            <div className="text-[13px] font-bold">{point[metric]} kg</div>
        </div>
    )
}

function WeightProgressChart({data, metric}: { data: ProgressData[]; metric: ProgressMetric }) {
    return (
        <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data} margin={{top: 8, right: 10, left: 10, bottom: 0}}>
                <defs>
                    <linearGradient id="weightProgressFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    interval="preserveStartEnd"
                    minTickGap={24}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                    tick={{fill: "var(--color-text-muted)", fontSize: 11}}
                />
                <Tooltip content={(props) => <ProgressTooltip {...props} metric={metric}/>} cursor={{stroke: "var(--color-text-faint)", strokeDasharray: "3 3"}}/>
                <Area
                    type="monotone"
                    dataKey={metric}
                    stroke="var(--color-accent)"
                    strokeWidth={2.5}
                    fill="url(#weightProgressFill)"
                    dot={(props) => <ProgressDot {...props} isLast={props.index === data.length - 1}/>}
                    activeDot={{r: 5, fill: "var(--color-accent)", stroke: "var(--color-bg)", strokeWidth: 2}}
                    isAnimationActive
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

const graphSwitcher: { label: string; metric: ProgressMetric; title: string }[] = [
    {label: 'Váha', metric: 'weight', title: 'Progres váhy'},
    {label: 'Objem', metric: 'volume', title: 'Progres objemu'},
    {label: 'Odhad 1RM', metric: 'estimated1RM', title: 'Progres odhadu 1RM'},
]

function formatProgressDelta(data: ProgressData[], metric: ProgressMetric): { text: string; positive: boolean } | null {
    if (data.length < 2) return null

    const first = data[0]
    const last = data[data.length - 1]
    const delta = last[metric] - first[metric]

    const months = Math.max(1, Math.round(
        (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    ))

    return {
        text: `${delta > 0 ? '+' : ''}${delta} kg za ${months} mes.`,
        positive: delta >= 0
    }
}

function ExerciseDetailPage() {

    const { id } = useParams<{id: string}>()
    const navigate = useNavigate()

    const { showError, showSuccess } = useToast()

    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState<ProgressMetric>(graphSwitcher[0].metric);
    const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
    const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistoryRow[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasMore, setHasMore] = useState(true)

    const requestIdRef = useRef(0)
    const loadingRef = useRef(false)
    const pageRef = useRef(0)
    const size = 10
    const sentinelRef = useRef<HTMLDivElement>(null)

    const loadNextHistoryPage = (pageToLoad: number) => {
        if (loadingRef.current || !hasMore) return
        loadingRef.current = true
        setLoadingHistory(true)
        const requestId = requestIdRef.current
        exerciseApi.exerciseHistory(Number(id), pageToLoad, size)
            .then(data => {
                if (requestIdRef.current !== requestId) return
                setExerciseHistory((curr) => [...curr, ...data.content])
                setHasMore(!data.last)
                pageRef.current = pageToLoad + 1
            }).finally(() => {
                if (requestIdRef.current !== requestId) return
                loadingRef.current = false
                setLoadingHistory(false)
        })
    }

    useEffect(() => {
        exerciseApi.exerciseStats(Number(id)).then(stats => setExerciseStats(stats))
            .catch((err) => {
                if (err.response?.status === 404) {
                    showError("Cvik sa nenašiel")
                }
                navigate("/exercises")
            })
    }, []);

    const loadNextHistoryPageRef = useRef(loadNextHistoryPage)
    useEffect(() => {
        loadNextHistoryPageRef.current = loadNextHistoryPage
    });

    useEffect(() => {
        requestIdRef.current += 1
        loadingRef.current = false
        setLoadingHistory(false)
        setExerciseHistory([])
        setHasMore(true)
        pageRef.current = 0
        loadNextHistoryPage(0)
    }, [id]);

    useEffect(() => {
        const node = sentinelRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadNextHistoryPageRef.current(pageRef.current)
            },
            { rootMargin: '200px' }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [hasMore, exerciseHistory.length]);

    if (!exerciseStats) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-12 h-12 rounded-full border-3 border-white/10 border-t-accent animate-spin" />
            </div>
        )
    }

    const hasHistory = exerciseStats.totalWorkouts > 0
    const progressDelta = formatProgressDelta(exerciseStats.progressData, selectedGraph)

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between px-5 pt-1.5 pb-3">
               <button className="w-9.5 h-9.5 rounded-full bg-btn border border-white/8 text-xl leading-none cursor-pointer"
                       onClick={() => navigate(-1)}>‹</button>
                <div className="text-[16px] font-extrabold">{exerciseStats.name}</div>
                <div className={"relative"}>
                    <button className="w-9.5 h-9.5 rounded-full bg-btn border border-white/8 text-base leading-none cursor-pointer"
                            onClick={() => setMenuOpen((open) => !open)}>⋯</button>
                    { menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-btn border border-white/[0.07] rounded-xl overflow-hidden z-10 shadow-lg">
                            <button
                                onClick={() => navigate(`/exercises/${id}/edit`)}
                                className="w-full flex items-center gap-2 text-left px-4 py-3 text-[13.5px] text-white font-semibold hover:bg-white/10 cursor-pointer transition-colors"><PencilIcon size={14} /> Upravit cvik</button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false)
                                    setConfirmDelete(true)
                                }}
                                className="w-full flex items-center gap-2 text-left px-4 py-3 text-[13.5px] font-semibold text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors">
                                <TrashIcon size={14}/>Vymazať cvik
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-center gap-2 -mt-1.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[12.5px] font-bold">
                    {muscleGroupLabel[exerciseStats.muscleGroup]}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-chip border border-white/10 text-text-secondary text-[12.5px] font-bold">
                    {equipmentLabel[exerciseStats.equipment]}
                </div>
            </div>
            <div className="flex gap-2.5 px-5 pt-2">
                <div className="flex-1 flex flex-col justify-between gap-3 min-h-19 rounded-2xl bg-carbs/16 border border-carbs/22 p-3.5">
                    <div className="flex items-center gap-1 text-carbs/80 text-[10.5px] font-semibold">
                        <span>🏆</span> PR
                    </div>
                    <div className="text-carbs text-[19px] font-extrabold leading-none">
                        {hasHistory ? <>{exerciseStats.pr} <span className="text-[11px] font-semibold">kg</span></> : '–'}
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-3 min-h-19 rounded-2xl bg-btn border border-white/8 p-3.5">
                    <div className="text-text-muted text-[10.5px] font-semibold">Posledný</div>
                    <div className="text-[19px] font-extrabold leading-none">
                        {hasHistory ? <>{exerciseStats.lastTraining} <span className="text-[11px] font-semibold text-text-muted">kg</span></> : '–'}
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-3 min-h-19 rounded-2xl bg-btn border border-white/8 p-3.5">
                    <div className="text-text-muted text-[10.5px] font-semibold">Tréningy</div>
                    <div className="text-[19px] font-extrabold leading-none">{exerciseStats.totalWorkouts}</div>
                </div>
            </div>
            {hasHistory ? (
                <>
                    <div className="mx-5 mt-3 rounded-2xl bg-card border border-white/[0.07] p-4">
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-[13.5px] font-bold">{graphSwitcher.find((g) => g.metric === selectedGraph)?.title}</div>
                            {progressDelta && (
                                <div className={`text-[12px] font-bold ${progressDelta.positive ? 'text-accent' : 'text-danger'}`}>
                                    {progressDelta.text}
                                </div>
                            )}
                        </div>
                        <WeightProgressChart data={exerciseStats.progressData} metric={selectedGraph}/>
                    </div>
                    <div className="flex gap-2 px-5 mt-3 pb-1">
                        {graphSwitcher.map(({label, metric}) => (
                            <button key={label}
                                    type="button"
                                    onClick={() => setSelectedGraph(metric)}
                                    className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                                        selectedGraph === metric
                                            ? 'bg-chip border-2 border-accent text-accent'
                                        : 'bg-chip border border-white/10 text-text-secondary'
                                    }`} >
                                {label}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="mx-5 mt-3 rounded-2xl bg-card border border-white/[0.07] p-6 flex flex-col items-center text-center gap-1">
                    <div className="text-[13.5px] font-bold">Zatiaľ žiadne záznamy</div>
                    <div className="text-text-muted text-[12.5px]">Progres sa zobrazí po prvom zaznamenanom tréningu s týmto cvikom</div>
                </div>
            )}
            <div className="px-[22px] pt-4 pb-1.5">
                <span className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase">História záznamov</span>
            </div>
            <div className="px-5">
                {exerciseHistory.map((record, index) => (
                    <WorkoutRow
                        key={record.id}
                        id={record.id}
                        name={record.name}
                        date={record.date}
                        month={record.month}
                        pr={record.pr}
                        meta={record.meta}
                        weight={record.weight}
                        index={index}
                    />
                ))}
                {hasMore && <div ref={sentinelRef} className="h-4" />}
            </div>
            {!loadingHistory && exerciseHistory.length === 0 && (
                <div className="flex flex-1 justify-center items-center text-text-muted font-medium">
                    Nenašiel sa žiaden tréning
                </div>
            )}

            {loadingHistory && hasMore && (
                <div className="flex flex-1 justify-center items-center py-4">
                    <div className="w-12 h-12 rounded-full border-3 border-white/10 border-t-accent animate-spin" />
                </div>
            )}

            {confirmDelete && <ConfirmDialog
                title={"Vymazať cvik"}
                description={"Vymažu sa aj všetky záznamy s týmto cvikom. Naozaj chcete vymazať cvik?"}
                onConfirm={() => {
                    exerciseApi.deleteExercise(Number(id))
                        .then(() => {
                            navigate("/exercises")
                            showSuccess("Cvik vymazaný")
                        })
                }}
                onCancel={() => setConfirmDelete(false)}
                confirmLabel={"Vymazať"}
                cancelLabel={"Zavrieť"}
                confirmColor={"red"} />
            }

            <BottomNav />
        </div>
    )
}

export default ExerciseDetailPage;