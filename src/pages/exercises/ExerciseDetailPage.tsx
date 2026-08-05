import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis} from "recharts";
import type {TooltipContentProps} from "recharts";
import TrashIcon from "../../components/icons/TrashIcon.tsx";
import PencilIcon from "../../components/icons/PencilIcon.tsx";
import WorkoutRow from "../../components/WorkoutRow.tsx";
import {formatShortDate} from "../../utils/formatDateTime.ts";
import type {WorkoutSummary} from "../../types/WorkoutSummary.ts";
import type {ExerciseStats} from "../../types/Exercises.ts";
import {exerciseApi} from "../../api/exercisesApi.ts";
import {useToast} from "../../context/ToastContext.tsx";

type ProgressPoint = { date: string; weight: number }
type ExerciseHistoryRecord = WorkoutSummary & { weight: number }

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

function ProgressTooltip({active, payload}: TooltipContentProps) {
    if (!active || !payload?.length) return null

    const point = payload[0].payload as ProgressPoint

    return (
        <div className="bg-btn border border-white/10 rounded-lg px-2.5 py-1.5 shadow-lg">
            <div className="text-text-muted text-[10px]">{formatShortDate(point.date)}</div>
            <div className="text-[13px] font-bold">{point.weight} kg</div>
        </div>
    )
}

function WeightProgressChart({data}: { data: ProgressPoint[]}) {
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
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                    tick={{fill: "var(--color-text-muted)", fontSize: 11}}
                />
                <Tooltip content={ProgressTooltip} cursor={{stroke: "var(--color-text-faint)", strokeDasharray: "3 3"}}/>
                <Area
                    type="monotone"
                    dataKey="weight"
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

const graphSwitcher: string[] = ['Váha','Objem','Odhad 1RM']

function ExerciseDetailPage() {

    const { id } = useParams<{id: string}>()
    const navigate = useNavigate()

    const { showError } = useToast()

    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState(graphSwitcher[0]);
    const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);

    useEffect(() => {
        exerciseApi.exerciseStats(Number(id)).then(stats => setExerciseStats(stats))
            .catch((err) => {
                if (err.response?.status === 404) {
                    showError("Cvik sa nenašiel")
                }
                navigate("/exercises")
            })
    }, []);

    if (!exerciseStats) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-12 h-12 rounded-full border-3 border-white/10 border-t-accent animate-spin" />
            </div>
        )
    }

    const history: ExerciseHistoryRecord[] = [
        {id: 1, name: "Push deň", date: "27", month: "JÚN", pr: true, meta: "4 série · 31 opakovaní · Objem 2 120 kg", weight: 80},
        {id: 2, name: "Push deň", date: "21", month: "JÚN", pr: false, meta: "4 série · 31 opakovaní · Objem 2 050 kg", weight: 75},
        {id: 3, name: "Push deň", date: "14", month: "JÚN", pr: false, meta: "4 série · 28 opakovaní · Objem 1 842,5 kg", weight: 72.5},
        {id: 4, name: "Push deň", date: "07", month: "JÚN", pr: false, meta: "4 série · 27 opakovaní · Objem 1 755 kg", weight: 70},
    ]

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
                            <button className="w-full flex items-center gap-2 text-left px-4 py-3 text-[13.5px] text-white font-semibold hover:bg-white/10 cursor-pointer transition-colors"><PencilIcon size={14} /> Upravit cvik</button>
                            <button className="w-full flex items-center gap-2 text-left px-4 py-3 text-[13.5px] font-semibold text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"><TrashIcon size={14}/>Vymazať cvik</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2.5 px-5 pt-2">
                <div className="flex-1 flex flex-col justify-between gap-3 min-h-19 rounded-2xl bg-carbs/16 border border-carbs/22 p-3.5">
                    <div className="flex items-center gap-1 text-carbs/80 text-[10.5px] font-semibold">
                        <span>🏆</span> PR
                    </div>
                    <div className="text-carbs text-[19px] font-extrabold leading-none">
                        {exerciseStats.pr} <span className="text-[11px] font-semibold">kg</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-3 min-h-19 rounded-2xl bg-btn border border-white/8 p-3.5">
                    <div className="text-text-muted text-[10.5px] font-semibold">Posledný</div>
                    <div className="text-[19px] font-extrabold leading-none">
                        {exerciseStats.lastTraining} <span className="text-[11px] font-semibold text-text-muted">kg</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-3 min-h-19 rounded-2xl bg-btn border border-white/8 p-3.5">
                    <div className="text-text-muted text-[10.5px] font-semibold">Tréningy</div>
                    <div className="text-[19px] font-extrabold leading-none">{exerciseStats.totalWorkouts}</div>
                </div>
            </div>
            <div className="mx-5 mt-3 rounded-2xl bg-card border border-white/[0.07] p-4">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-[13.5px] font-bold">Progres váhy</div>
                    <div className="text-accent text-[12px] font-bold">+15 kg za 3 mes.</div>
                </div>
                <WeightProgressChart data={exerciseStats.progressData}/>
            </div>
            <div className="flex gap-2 px-5 mt-3 pb-1">
                {graphSwitcher.map((label) => (
                    <button key={label}
                            type="button"
                            onClick={() => setSelectedGraph(label)}
                            className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                                selectedGraph === label
                                    ? 'bg-chip border-2 border-accent text-accent'
                                : 'bg-chip border border-white/10 text-text-secondary'
                            }`} >
                        {label}
                    </button>
                ))}
            </div>
            <div className="px-[22px] pt-4 pb-1.5">
                <span className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase">História záznamov</span>
            </div>
            <div className="px-5">
                {history.map((record, index) => (
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
            </div>
        </div>
    )
}

export default ExerciseDetailPage;