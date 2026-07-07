import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
    )
}

const muscleGroupFilters = ['Všetko', 'Hrudník', 'Chrbát', 'Nohy']

const allExercises = [
    { name: 'Bench press', muscleGroup: 'Hrudník', equipment: 'činka' },
    { name: 'Sklon. tlaky s činkami', muscleGroup: 'Hrudník', equipment: 'jednoručky' },
    { name: 'Tlaky nad hlavu', muscleGroup: 'Ramená', equipment: 'činka' },
    { name: 'Bicepsový zdvih', muscleGroup: 'Ruky', equipment: 'jednoručky' },
    { name: 'Mŕtvy ťah', muscleGroup: 'Chrbát', equipment: 'činka' },
    { name: 'Drepy', muscleGroup: 'Nohy', equipment: 'činka' },
]

function AddExerciseToWorkoutPage() {

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Všetko');
    const [selectedNames, setSelectedNames] = useState(['Bench press', 'Sklon. tlaky s činkami']);

    function toggleExercise(name: string) {
        setSelectedNames((current) =>
            current.includes(name) ? current.filter((n) => n !== name) : [...current, name]
        );
    }

    const selectedExercises = allExercises.filter((exercise) => selectedNames.includes(exercise.name));

    const unselectedExercises = allExercises
        .filter((exercise) => !selectedNames.includes(exercise.name))
        .filter((exercise) => selectedFilter === 'Všetko' || exercise.muscleGroup === selectedFilter)
        .filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col min-h-screen pb-8">
            <div className="flex items-center justify-between mt-5 mx-2">
                <button
                    onClick={() => navigate('/workout/new')}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-xl cursor-pointer"
                >
                    ‹
                </button>
                <div className="text-[17px] font-extrabold">Pridať cvik</div>
                <button
                    onClick={() => navigate('/workout/new')}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-muted text-base cursor-pointer"
                >
                    ⨯
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

            <div className="flex gap-2 px-5 mt-3">
                {muscleGroupFilters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                            selectedFilter === filter
                                ? 'bg-chip border-2 border-accent text-accent'
                                : 'bg-chip border border-white/10 text-text-secondary'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="px-5 mt-5">
                <div className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase mb-1">
                    Vybrané ({selectedExercises.length})
                </div>
                {selectedExercises.map((exercise) => (
                    <div
                        key={exercise.name}
                        onClick={() => toggleExercise(exercise.name)}
                        className="flex items-center gap-3 py-[13px] border-b border-white/5 last:border-b-0 cursor-pointer"
                    >
                        <span className="w-[34px] h-[34px] rounded-xl bg-accent/[0.14] text-accent flex items-center justify-center text-sm font-extrabold shrink-0">
                            ✓
                        </span>
                        <div className="flex-1">
                            <div className="text-[14.5px] font-bold">{exercise.name}</div>
                            <div className="text-text-muted text-[11.5px] mt-0.5">
                                {exercise.muscleGroup} · {exercise.equipment}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 mt-5">
                <div className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase mb-1">
                    Všetky cviky
                </div>
                {unselectedExercises.map((exercise) => (
                    <div
                        key={exercise.name}
                        onClick={() => toggleExercise(exercise.name)}
                        className="flex items-center gap-3 py-[13px] border-b border-white/5 last:border-b-0 cursor-pointer"
                    >
                        <span className="w-[34px] h-[34px] rounded-xl bg-btn border border-white/8 text-text-muted flex items-center justify-center text-lg shrink-0">
                            +
                        </span>
                        <div className="flex-1">
                            <div className="text-[14.5px] font-bold">{exercise.name}</div>
                            <div className="text-text-muted text-[11.5px] mt-0.5">
                                {exercise.muscleGroup} · {exercise.equipment}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 mt-6">
                <button
                    onClick={() => navigate('/workout/new')}
                    className="w-full bg-accent text-on-accent rounded-2xl py-4 text-[15px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                >
                    Pridať {selectedExercises.length} {selectedExercises.length === 1 ? 'cvik' : 'cviky'}
                </button>
            </div>
        </div>
    )
}

export default AddExerciseToWorkoutPage
