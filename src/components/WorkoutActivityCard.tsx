import {useEffect, useState} from "react";
import ChevronDownIcon from "./icons/ChevronDownIcon.tsx";
import CalendarIcon from "./icons/CalendarIcon.tsx";
import BarbellIcon from "./icons/BarbellIcon.tsx";
import ClockIcon from "./icons/ClockIcon.tsx";
import {workoutApi} from "../api/workoutApi.ts";
import type {CalendarDay} from "../types/calendarView.ts";
import type {WorkoutSessionsStats} from "../types/WorkoutSessionsStats.ts";
import {muscleGroupLabel} from "../types/Exercises.ts";

const WEEKDAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne']
const MONTH_NAMES = [
    'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
    'Júl', 'August', 'September', 'Október', 'November', 'December',
]

function daysSinceShort(days: number | null | undefined) {
    if (days == null) return '–'
    if (days === 0) return 'dnes'
    if (days === 1) return '1 deň'
    if (days <= 4) return `${days} dni`
    return `${days} dní`
}

type Cell = { day: number | null; trained: boolean; pr: boolean; isToday: boolean }

function DayCell({ cell }: { cell: Cell }) {
    return (
        <div className="relative flex items-center justify-center py-0.5">
            {cell.day !== null && (
                <>
                    <span
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-[12px] font-bold
                        ${cell.trained ? 'bg-accent text-on-accent' : 'text-text-secondary'}
                        ${cell.isToday && !cell.trained ? 'ring-1 ring-accent text-accent' : ''}`}
                    >
                        {cell.day}
                    </span>
                    {cell.pr && (
                        <span className="absolute top-0 right-1.5 w-1.5 h-1.5 rounded-full bg-carbs" />
                    )}
                </>
            )}
        </div>
    )
}

function WeekRow({ week }: { week: Cell[] }) {
    return (
        <div className="grid grid-cols-7">
            {week.map((cell, i) => (
                <DayCell key={i} cell={cell} />
            ))}
        </div>
    )
}

function WeekdayHeader() {
    return (
        <div className="grid grid-cols-7 text-center mb-1.5">
            {WEEKDAYS.map((day) => (
                <span key={day} className="text-text-faint text-[10px] font-bold">{day}</span>
            ))}
        </div>
    )
}

function ToggleButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-1 mt-3 py-1 text-accent text-[12px] font-bold cursor-pointer"
        >
            {expanded ? 'Zobraziť len týždeň' : 'Zobraziť celý mesiac'}
            <span className={`inline-flex transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                <ChevronDownIcon size={13} />
            </span>
        </button>
    )
}

function WorkoutActivityCard({ stats, year, month, onMonthChange }: {
    stats: WorkoutSessionsStats | null
    year: number
    month: number
    onMonthChange: (year: number, month: number) => void
}) {
    const [expanded, setExpanded] = useState(false)

    const today = new Date()
    const monthLabel = MONTH_NAMES[month]
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
    const [loading, setLoading] = useState(true)
    const [trainedDays, setTrainedDays] = useState<CalendarDay[]>([])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setTrainedDays([])
        workoutApi.getCalendarView(year, month + 1).then((data) => {
            if (!cancelled) {
                setLoading(false)
                setTrainedDays(data.days)
            }
        })
        return () => { cancelled = true }
    }, [year, month]);

    const changeMonth = (delta: number) => {
        const d = new Date(year, month + delta, 1)
        onMonthChange(d.getFullYear(), d.getMonth())
    }
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

    const monthCells: Cell[] = []
    for (let i = 0; i < firstWeekday; i++) {
        monthCells.push({ day: null, trained: false, pr: false, isToday: false })
    }
    for (let day = 1; day <= daysInMonth; day++) {
        monthCells.push({
            day,
            trained: false,
            pr: false,
            isToday: isCurrentMonth && day === today.getDate(),
        })
    }
    for (let td of trainedDays) {
        const index = firstWeekday + td.dayOfMonth - 1
        if (index >= 0 && index < monthCells.length) {
            monthCells[index].trained = true
            monthCells[index].pr = td.pr
        }
    }

    while (monthCells.length % 7 !== 0) {
        monthCells.push({ day: null, trained: false, pr: false, isToday: false })
    }

    const weeks: Cell[][] = []
    for (let i = 0; i < monthCells.length; i += 7) {
        weeks.push(monthCells.slice(i, i + 7))
    }
    const currentWeekIndex = Math.max(0, weeks.findIndex((week) => week.some((cell) => cell.isToday)))
    const weeksBefore = weeks.slice(0, currentWeekIndex)
    const currentWeek = weeks[currentWeekIndex]
    const weeksAfter = weeks.slice(currentWeekIndex + 1)

    return (
        <div className="mx-5 mt-4 p-5 bg-card border border-white/[0.09] rounded-3xl">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => changeMonth(-1)}
                    aria-label="Predchádzajúci mesiac"
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-chip text-text-secondary cursor-pointer transition-all duration-150 hover:bg-white/6 active:scale-[0.94]"
                >
                    <span className="inline-flex rotate-90"><ChevronDownIcon size={16} /></span>
                </button>
                <span className="relative text-[15px] font-extrabold">
                    {monthLabel} {year}
                    {loading && (
                        <span className="absolute -right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                    )}
                </span>
                <button
                    onClick={() => changeMonth(1)}
                    disabled={isCurrentMonth}
                    aria-label="Nasledujúci mesiac"
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-chip text-text-secondary cursor-pointer transition-all duration-150 hover:bg-white/6 active:scale-[0.94] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-chip disabled:active:scale-100"
                >
                    <span className="inline-flex -rotate-90"><ChevronDownIcon size={16} /></span>
                </button>
            </div>

            <div className="relative">
                {/* neviditeľná zbalená kópia drží výšku karty; živý kalendár ju prekrýva a rozbaľuje sa cez štatistiky */}
                <div className="invisible" aria-hidden>
                    <WeekdayHeader />
                    <WeekRow week={currentWeek} />
                    <ToggleButton expanded={false} onClick={() => {}} />
                </div>

                <div
                    className={`absolute top-0 inset-x-0 -mx-5 px-5 z-20 bg-card rounded-b-3xl`}
                >
                    <div className={`transition-opacity duration-200 ${loading ? 'opacity-40' : 'opacity-100'}`}>
                        <WeekdayHeader />

                        <div
                            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                            style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
                        >
                            <div className="overflow-hidden">
                                <div className="flex flex-col gap-1.5 pb-1.5">
                                    {weeksBefore.map((week, i) => (
                                        <WeekRow key={i} week={week} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <WeekRow week={currentWeek} />

                        <div
                            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                            style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
                        >
                            <div className="overflow-hidden">
                                <div className="flex flex-col gap-1.5 pt-1.5">
                                    {weeksAfter.map((week, i) => (
                                        <WeekRow key={i} week={week} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToggleButton expanded={expanded} onClick={() => setExpanded((e) => !e)} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                <div className="p-2 rounded-xl bg-accent/[0.08] flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-accent/[0.16] flex items-center justify-center text-accent shrink-0">
                        <CalendarIcon size={12} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-extrabold leading-none">{stats?.workoutsLast30Days ?? '–'}</div>
                        <div className="text-text-muted text-[9px] mt-0.5 truncate">tréningov / 30 dní</div>
                    </div>
                </div>
                <div className="p-2 rounded-xl bg-carbs/[0.08] flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-carbs/[0.16] flex items-center justify-center shrink-0 text-[11px]">
                        🏆
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-extrabold leading-none">{stats?.prsLast30Days ?? '–'}</div>
                        <div className="text-text-muted text-[9px] mt-0.5 truncate">nové rekordy / 30 dní</div>
                    </div>
                </div>
                <div className="p-2 rounded-xl bg-chip flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-text-faint shrink-0">
                        <BarbellIcon size={12} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[12px] font-bold leading-tight truncate">{stats?.neglectedMuscleGroup ? muscleGroupLabel[stats.neglectedMuscleGroup.muscleGroup] : '–'}</div>
                        <div className="text-text-faint text-[9px] mt-0.5">{stats?.neglectedMuscleGroup
                                ? stats.neglectedMuscleGroup.daysSinceLastTrained === null
                                    ? 'zatiaľ netrénované'
                                    : `zanedbané · ${daysSinceShort(stats.neglectedMuscleGroup.daysSinceLastTrained)}`
                                : 'zanedbaná partia'}</div>
                    </div>
                </div>
                <div className="p-2 rounded-xl bg-chip flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-text-faint shrink-0">
                        <ClockIcon size={12} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[12px] font-bold leading-tight truncate">{daysSinceShort(stats?.daysSinceLastWorkout)}</div>
                        <div className="text-text-faint text-[9px] mt-0.5">od tréningu</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkoutActivityCard
