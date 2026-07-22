import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav.tsx";
import SearchIcon from "../../components/icons/SearchIcon.tsx";
import ExerciseRow from "./ExerciseRow.tsx";
import { type MuscleGroup, muscleGroupLabel } from "../../types/Exercises.ts";

const ALL_FILTER = 'ALL' as const;
type MuscleGroupFilter = typeof ALL_FILTER | MuscleGroup;

const muscleGroupFilters: MuscleGroupFilter[] = [ALL_FILTER, ...Object.keys(muscleGroupLabel) as MuscleGroup[]]

const muscleGroupFilterLabel: Record<MuscleGroupFilter, string> = {
    [ALL_FILTER]: 'Všetko',
    ...muscleGroupLabel,
}

const exercises: { name: string; muscleGroup: MuscleGroup; pr: boolean; lastDate: string; lastWeight: number; trend: number[]; accent: boolean }[] = [
    { name: 'Bench press', muscleGroup: 'CHEST', pr: true, lastDate: '27. jún', lastWeight: 80, trend: [60, 64, 68, 72, 76, 80], accent: true },
    { name: 'Sklon. tlaky s činkami', muscleGroup: 'CHEST', pr: false, lastDate: '11. jún', lastWeight: 28, trend: [26, 27, 26, 28, 27, 28], accent: false },
    { name: 'Drepy', muscleGroup: 'QUADRICEPS', pr: true, lastDate: '23. jún', lastWeight: 120, trend: [90, 95, 100, 110, 115, 120], accent: true },
    { name: 'Mŕtvy ťah', muscleGroup: 'BACK', pr: false, lastDate: '19. jún', lastWeight: 150, trend: [148, 150, 149, 150, 150, 150], accent: false },
    { name: 'Tlaky nad hlavu', muscleGroup: 'SHOULDERS', pr: false, lastDate: '14. jún', lastWeight: 45, trend: [35, 38, 40, 42, 44, 45], accent: true },
    { name: 'Bicepsový zdvih', muscleGroup: 'BICEPS', pr: false, lastDate: '9. jún', lastWeight: 20, trend: [16, 17, 18, 19, 19, 20], accent: true },
    { name: 'Priťahovanie v predklone', muscleGroup: 'BACK', pr: false, lastDate: '25. jún', lastWeight: 62, trend: [55, 57, 58, 60, 61, 62], accent: true },
]

function ExercisesListPage() {

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<MuscleGroupFilter>(ALL_FILTER);

    const filteredExercises = exercises
        .filter((exercise) => selectedFilter === ALL_FILTER || exercise.muscleGroup === selectedFilter)
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
                    className="p-2 text-[13px] rounded-xl bg-accent text-on-accent flex items-center justify-center font-bold cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.95]"
                >
                    Nový cvik +
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
                        {muscleGroupFilterLabel[filter]}
                    </button>
                ))}
            </div>

            <div className="px-5 mt-2">
                {filteredExercises.map((exercise) => (
                    <ExerciseRow
                        name={exercise.name}
                        muscleGroup={exercise.muscleGroup}
                        lastDate={exercise.lastDate}
                        lastWeight={exercise.lastWeight} />
                ))}
            </div>

            <BottomNav />
        </div>
    )
}

export default ExercisesListPage
