import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, LineChart } from "recharts";
import BottomNav from "../../components/BottomNav.tsx";
import BarbellIcon from "../../components/icons/BarbellIcon.tsx";
import SearchIcon from "../../components/icons/SearchIcon.tsx";

function Sparkline({ data, accent }: { data: number[]; accent: boolean }) {
    const points = data.map((value, index) => ({ index, value }))
    return (
        <LineChart width={64} height={28} data={points}>
            <Line
                type="monotone"
                dataKey="value"
                stroke={accent ? 'var(--color-accent)' : 'var(--color-text-faint)'}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
            />
        </LineChart>
    )
}

const muscleGroupFilters = ['Všetko', 'Hrudník', 'Chrbát', 'Nohy', 'Ramená', 'Ruky', 'Brucho']

const exercises = [
    { name: 'Bench press', muscleGroup: 'Hrudník', pr: true, lastDate: '27. jún', lastWeight: 80, trend: [60, 64, 68, 72, 76, 80], accent: true },
    { name: 'Sklon. tlaky s činkami', muscleGroup: 'Hrudník', pr: false, lastDate: '11. jún', lastWeight: 28, trend: [26, 27, 26, 28, 27, 28], accent: false },
    { name: 'Drepy', muscleGroup: 'Nohy', pr: true, lastDate: '23. jún', lastWeight: 120, trend: [90, 95, 100, 110, 115, 120], accent: true },
    { name: 'Mŕtvy ťah', muscleGroup: 'Chrbát', pr: false, lastDate: '19. jún', lastWeight: 150, trend: [148, 150, 149, 150, 150, 150], accent: false },
    { name: 'Tlaky nad hlavu', muscleGroup: 'Ramená', pr: false, lastDate: '14. jún', lastWeight: 45, trend: [35, 38, 40, 42, 44, 45], accent: true },
    { name: 'Bicepsový zdvih', muscleGroup: 'Ruky', pr: false, lastDate: '9. jún', lastWeight: 20, trend: [16, 17, 18, 19, 19, 20], accent: true },
    { name: 'Priťahovanie v predklone', muscleGroup: 'Chrbát', pr: false, lastDate: '25. jún', lastWeight: 62, trend: [55, 57, 58, 60, 61, 62], accent: true },
]

function ExercisesListPage() {

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Všetko');

    const filteredExercises = exercises
        .filter((exercise) => selectedFilter === 'Všetko' || exercise.muscleGroup === selectedFilter)
        .filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between mt-5 mx-2">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-xl cursor-pointer"
                >
                    ‹
                </button>
                <div className="flex-1 flex items-baseline gap-2 pl-3">
                    <span className="text-[22px] font-extrabold">Cviky</span>
                    <span className="text-text-muted text-[13px]">{exercises.length} cvikov</span>
                </div>
                <button
                    onClick={() => navigate('/exercises/create')}
                    className="w-10 h-10 rounded-2xl bg-accent text-on-accent flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.95]"
                >
                    +
                </button>
            </div>

            <div className="px-5 mt-4">
                <div className="flex items-center gap-2.5 bg-chip border border-white/8 rounded-2xl px-4 py-3">
                    <span className="text-text-faint">
                        <SearchIcon />
                    </span>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Hľadať cvik..."
                        className="flex-1 bg-transparent outline-none text-[14px] text-text-primary placeholder:text-text-faint"
                    />
                </div>
            </div>

            <div className="flex gap-2 px-5 mt-3 pb-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                {muscleGroupFilters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setSelectedFilter(filter)}
                        className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                            selectedFilter === filter
                                ? 'bg-chip border-2 border-accent text-accent'
                                : 'bg-chip border border-white/10 text-text-secondary'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="px-5 mt-2">
                {filteredExercises.map((exercise) => (
                    <div
                        key={exercise.name}
                        className="flex items-center gap-[13px] py-[13px] border-b border-white/5 last:border-b-0 cursor-pointer"
                    >
                        <div className="w-[46px] h-[46px] rounded-2xl bg-btn border border-white/8 flex items-center justify-center text-text-secondary shrink-0">
                            <BarbellIcon />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[14.5px] font-bold">
                                {exercise.name}
                                {exercise.pr && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-carbs/[0.16] text-carbs text-[9px] font-extrabold shrink-0">
                                        🏆 PR
                                    </span>
                                )}
                            </div>
                            <div className="text-text-muted text-xs mt-0.5">
                                {exercise.muscleGroup} · naposledy {exercise.lastDate} · {exercise.lastWeight} kg
                            </div>
                        </div>
                        <Sparkline data={exercise.trend} accent={exercise.accent} />
                        <span className="text-text-faint text-lg">›</span>
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    )
}

export default ExercisesListPage
