import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    MuscleGroupCategory,
    muscleGroupLabel,
    muscleGroupsInCategory,
    type Exercise,
    type MuscleGroup,
} from "../types/Exercises.ts";
import {fetchExercises} from "../api/exercisesApi.ts";
import SearchIcon from "../components/icons/SearchIcon.tsx";
import {workoutApi} from "../api/workoutApi.ts";
import type {PageResponse} from "../types/PageResponse.ts";

function ChevronDownIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    )
}

const categoryFilters: (MuscleGroupCategory | 'Všetko')[] = ['Všetko', ...Object.values(MuscleGroupCategory)]


function AddExerciseToWorkoutPage() {

    const { id } = useParams<{id: string}>()

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<MuscleGroupCategory | 'Všetko'>('Všetko');
    const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
    const [subFiltersOpen, setSubFiltersOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const [page, setPage] = useState(0);
    const [pageInfo, setPageInfo] = useState<PageResponse<Exercise>>(
        {
            last: false,
            content: [],
            page: 0,
            size: 0,
            totalElements: 0,
            totalPages: 0
        }
    )
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        fetchExercises(page, 10).then((data) => {
            setExercises(data.content)
            setPage(page + 1)
            setPageInfo(data)
            setLoading(false)
        })
    }, []);

    function selectCategory(category: MuscleGroupCategory | 'Všetko') {
        setSelectedCategory(category);
        setSelectedGroup(null);
        setSubFiltersOpen(false);
    }

    function selectGroup(group: MuscleGroup) {
        setSelectedGroup((current) => (current === group ? null : group));
        setSubFiltersOpen(false);
    }

    function toggleExercise(id: number) {
        setSelectedIds((current) =>
            current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
        );
    }

    const groupsInCategory = selectedCategory === 'Všetko' ? [] : muscleGroupsInCategory(selectedCategory);

    const selectedExercises = selectedIds
        .map((selectedId) => exercises.find((exercise) => exercise.id === selectedId))
        .filter((exercise) => exercise !== undefined)

    const unselectedExercises = (exercises) ? exercises
        .filter((exercise) => !selectedIds.includes(exercise.id))
        .filter((exercise) => {
            if (selectedCategory === 'Všetko') return true;
            if (selectedGroup) return exercise.muscleGroup === selectedGroup;
            return groupsInCategory.includes(exercise.muscleGroup);
        })
        .filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()))
        : [];

    return (
        <div className="flex flex-col min-h-screen pb-8">
            <div className="flex items-center justify-between mt-5 mx-2">
                <button
                    onClick={() => navigate(`/workouts/${id}/active`)}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-xl cursor-pointer"
                >
                    ‹
                </button>
                <div className="text-[17px] font-extrabold">Pridať cvik</div>
                <button
                    onClick={() => navigate(`/workouts/${id}/active`)}
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

            <div className="flex gap-2 px-5 mt-3 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                {categoryFilters.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => selectCategory(category)}
                        className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                            selectedCategory === category
                                ? 'bg-chip border-2 border-accent text-accent'
                                : 'bg-chip border border-white/10 text-text-secondary'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {groupsInCategory.length > 1 && (
                <div className="px-5 mt-2">
                    <button
                        type="button"
                        onClick={() => setSubFiltersOpen((open) => !open)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-colors duration-150 ${
                            selectedGroup
                                ? 'bg-chip border border-accent text-accent'
                                : 'bg-chip border border-white/10 text-text-muted'
                        }`}
                    >
                        {selectedGroup ? muscleGroupLabel[selectedGroup] : 'Upresniť partiu'}
                        <span className={`flex items-center transition-transform duration-200 ${subFiltersOpen ? 'rotate-180' : ''}`}>
                            <ChevronDownIcon />
                        </span>
                    </button>

                    <div

                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                            subFiltersOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                    >
                        <div className="overflow-hidden">
                            <div className="flex flex-wrap gap-2 pt-2">
                                {groupsInCategory.map((group) => (
                                    <button
                                        key={group}
                                        type="button"
                                        onClick={() => selectGroup(group)}
                                        className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-colors duration-150 ${
                                            selectedGroup === group
                                                ? 'bg-chip border border-accent text-accent'
                                                : 'bg-chip border border-white/10 text-text-muted'
                                        }`}
                                    >
                                        {muscleGroupLabel[group]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-5 mt-5">
                <div className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase mb-1">
                    Vybrané ({selectedExercises.length})
                </div>
                {selectedExercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        onClick={() => toggleExercise(exercise.id)}
                        className="flex items-center gap-3 py-[13px] border-b border-white/5 last:border-b-0 cursor-pointer"
                    >
                        <span className="w-[34px] h-[34px] rounded-xl bg-accent/[0.14] text-accent flex items-center justify-center text-sm font-extrabold shrink-0">
                            ✓
                        </span>
                        <div className="flex-1">
                            <div className="text-[14.5px] font-bold">{exercise.name}</div>
                            <div className="text-text-muted text-[11.5px] mt-0.5">
                                {muscleGroupLabel[exercise.muscleGroup]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 mt-5">
                <div className="text-text-faint text-[11px] font-bold tracking-[0.08em] uppercase mb-1">
                    Všetky cviky ({pageInfo.totalElements})
                </div>
                {unselectedExercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        onClick={() => toggleExercise(exercise.id)}
                        className="flex items-center gap-3 py-[13px] border-b border-white/5 last:border-b-0 cursor-pointer"
                    >
                        <span className="w-[34px] h-[34px] rounded-xl bg-btn border border-white/8 text-text-muted flex items-center justify-center text-lg shrink-0">
                            +
                        </span>
                        <div className="flex-1">
                            <div className="text-[14.5px] font-bold">{exercise.name}</div>
                            <div className="text-text-muted text-[11.5px] mt-0.5">
                                {muscleGroupLabel[exercise.muscleGroup]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!pageInfo.last  && !loading && (
                <button
                    className={"mx-5 mt-4 p-4 bg-card border border-white/[0.07] rounded-2xl font-bold text-center cursor-pointer hover:bg-card-hover transition-all duration-150 hover:brightness-110 active:scale-[0.97]"}
                    onClick={() => {
                        fetchExercises(page, 10).then((data) => {
                            setExercises((current) => [...current, ...data.content])
                            setPage(page+1)
                            setPageInfo(data)
                        })
                    }}
                >
                    Načítať ďalšie
                </button>
            )}


            <div className="px-5 mt-6">
                <button
                    disabled={selectedExercises.length === 0}
                    onClick={() => workoutApi.addExercise(Number(id), selectedIds, 1).then(
                            () => navigate(`/workouts/${id}/active`))}

                    className="w-full bg-accent text-on-accent rounded-2xl py-4 text-[15px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100"
                >
                    Pridať {selectedExercises.length} {selectedExercises.length === 1 ? 'cvik' : 'cviky'}
                </button>
            </div>

        </div>
    )
}

export default AddExerciseToWorkoutPage
