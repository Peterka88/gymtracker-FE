import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    MuscleGroupCategory,
    muscleGroupLabel,
    muscleGroupsInCategory,
    type Exercise,
    type MuscleGroup,
} from "../../types/Exercises.ts";
import { exerciseApi } from "../../api/exercisesApi.ts";
import SearchIcon from "../../components/icons/SearchIcon.tsx";
import {workoutApi} from "../../api/workoutApi.ts";
import { useToast } from "../../context/ToastContext.tsx"

function ChevronDownIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    )
}

const categoryFilters: (MuscleGroupCategory | 'Všetko')[] = ['Všetko', ...Object.values(MuscleGroupCategory)]


function AddExerciseToWorkoutPage() {

    const size = 10;

    const { id } = useParams<{id: string}>()
    const { showSuccess } = useToast()

    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<MuscleGroupCategory | 'Všetko'>('Všetko');
    const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
    const [subFiltersOpen, setSubFiltersOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [existingExerciseIds, setExistingExerciseIds] = useState<number[]>([]);

    useEffect(() => {
        if (!id) return
        workoutApi.getById(Number(id)).then((data) => {
            setExistingExerciseIds(data.sessionExercises.map((sessionExercise) => sessionExercise.exerciseId))
        })
    }, [id]);

    const loadingRef = useRef(false)
    const pageRef = useRef(0)
    const requestIdRef = useRef(0)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const activeMuscleGroups: MuscleGroup[] | undefined =
        selectedGroup !== null ? [selectedGroup]
            : selectedCategory !== 'Všetko'
                ? muscleGroupsInCategory(selectedCategory)
                : undefined

    const loadNextPage = (pageToLoad: number) => {
        if (loadingRef.current || !hasMore) return
        loadingRef.current = true
        setLoading(true)
        const requestId = requestIdRef.current
        exerciseApi.addToWorkout(pageToLoad, size, activeMuscleGroups, search)
            .then((data) => {
                if (requestIdRef.current !== requestId) return
                setExercises((curr) => [...curr, ...data.content])
                setHasMore(!data.last)
                pageRef.current = pageToLoad + 1
            }).finally(() => {
                if (requestIdRef.current !== requestId) return
                loadingRef.current = false
                setLoading(false)
        })
    }

    const resetAndLoad = () => {
        requestIdRef.current += 1
        loadingRef.current = false
        setExercises([])
        setLoading(false)
        setHasMore(true)
        pageRef.current = 0
        loadNextPage(0)
    }

    const loadNextPageRef = useRef(loadNextPage)
    useEffect(() => {
        loadNextPageRef.current = loadNextPage
    });

    const isFirstSearchRun = useRef(true)
    useEffect(() => {
        if (isFirstSearchRun.current) {
            isFirstSearchRun.current = false
            return
        }
        const timeout = setTimeout(resetAndLoad, 300)
        return () => clearTimeout(timeout)
    }, [search]);


    const isFirstFilterRun = useRef(true)
    useEffect(() => {
        if (isFirstFilterRun.current) {
            isFirstFilterRun.current = false
            return
        }
        resetAndLoad()
    }, [selectedGroup, selectedCategory]);

    useEffect(() => {
        const node = sentinelRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadNextPageRef.current(pageRef.current)
            },
            { rootMargin: '200px'}
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [hasMore, exercises.length]);

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
        .filter((exercise) => !existingExerciseIds.includes(exercise.id))
        .filter((exercise) => {
            if (selectedCategory === 'Všetko') return true;
            if (selectedGroup) return exercise.muscleGroup === selectedGroup;
            return groupsInCategory.includes(exercise.muscleGroup);
        })
        .filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()))
        : [];

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between mt-5 mx-2">
                <button
                    onClick={() => navigate(`/workouts/${id}/active`)}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-xl leading-none cursor-pointer"
                >
                    ‹
                </button>
                <div className="text-[17px] font-extrabold">Pridať cvik</div>
                <button
                    onClick={() => navigate('/exercises/create')}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-xl leading-none cursor-pointer"
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
                    Všetky cviky ({unselectedExercises.length})
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
                {hasMore && <div ref={sentinelRef} className="h-4" />}
            </div>

            {!loading && !hasMore && exercises.length === 0 && (
                <div className="flex flex-1 justify-center items-center text-text-muted font-medium">
                    Zoznam cvikov je prázdny
                </div>
            )}

            <div className="fixed left-0 right-0 bottom-0 max-w-[430px] mx-auto z-20 bg-bg border-t border-white/8 px-5 pt-3 pb-6">
                <button
                    disabled={selectedExercises.length === 0}
                    onClick={() => workoutApi.addExercise(Number(id), selectedIds).then(
                            () => {
                                navigate(`/workouts/${id}/active`)
                                showSuccess(`Pridané cviky - ${selectedExercises.length}`)
                            })}

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
