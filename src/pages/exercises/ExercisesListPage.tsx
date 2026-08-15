import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav.tsx";
import SearchIcon from "../../components/icons/SearchIcon.tsx";
import ExerciseRow from "./ExerciseRow.tsx";
import {
    type Exercise,
    type MuscleGroup,
    MuscleGroupCategory,
    muscleGroupLabel,
    muscleGroupsInCategory
} from "../../types/Exercises.ts";
import {exerciseApi} from "../../api/exercisesApi.ts";
import { formatExercises } from "../../utils/formatSeries.ts";


const CATEGORY_ALL = 'ALL' as const;
const ALL_FILTER = 'ALL' as const;

type CategoryFilter = typeof CATEGORY_ALL | MuscleGroupCategory
type MuscleGroupFilter = typeof ALL_FILTER | MuscleGroup;


const categoryFilters: CategoryFilter[] = [CATEGORY_ALL, ...Object.values(MuscleGroupCategory)]


const muscleGroupFilterLabel: Record<MuscleGroupFilter, string> = {
    [ALL_FILTER]: 'Všetko',
    ...muscleGroupLabel,
}

function ExercisesListPage() {

    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(CATEGORY_ALL)
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroupFilter>(ALL_FILTER);

    const [exercises, setExercises] = useState<Exercise[]>([])
    const [exercisesCount, setExercisesCount] = useState(0);

    const loadingRef = useRef(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageRef = useRef(0);
    const requestIdRef = useRef(0);
    const size = 10;
    const sentinelRef = useRef<HTMLDivElement>(null)

    const loadNextPage = (pageToLoad: number) => {
        if (loadingRef.current || !hasMore) return
        loadingRef.current = true
        setLoading(true)
        const requestId = requestIdRef.current
        exerciseApi.getExercises(pageToLoad, size, activeMuscleGroups, search)
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

    useEffect(() => {
        exerciseApi.info().then((data) => {
            setExercisesCount(data.totalExercises)
        })
    }, []);

    const loadNextPageRef = useRef(loadNextPage)
    useEffect(() => {
        loadNextPageRef.current = loadNextPage
    });

    const muscleGroupFilterOptions: MuscleGroupFilter[] = selectedCategory === CATEGORY_ALL ? [] : [ALL_FILTER, ...muscleGroupsInCategory(selectedCategory as MuscleGroupCategory)]

    const activeMuscleGroups: MuscleGroup[] | undefined =
        selectedMuscleGroup !== ALL_FILTER ? [selectedMuscleGroup]
            : selectedCategory !== CATEGORY_ALL
                ? muscleGroupsInCategory(selectedCategory as MuscleGroupCategory)
                : undefined


    const isFirstFilterRun = useRef(true)
    useEffect(() => {
        if (isFirstFilterRun.current) {
            isFirstFilterRun.current = false
            return
        }

        const timeout = setTimeout(() => {
            requestIdRef.current += 1
            loadingRef.current = false
            setLoading(false)
            setExercises([])
            setHasMore(true)
            pageRef.current = 0
            loadNextPage(0)
        }, 300)

        return () => clearTimeout(timeout)
    }, [selectedMuscleGroup, selectedCategory, search]);

    useEffect(() => {
        const node = sentinelRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadNextPageRef.current(pageRef.current)
            },
            { rootMargin: '200px' }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [hasMore, exercises.length]);

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between mt-5 mx-2">
                <button
                    onClick={() => navigate(-1)}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-xl leading-none cursor-pointer"
                >
                    ‹
                </button>
                <div className="flex-1 flex items-baseline gap-2 pl-3">
                    <span className="text-[22px] font-extrabold">Cviky</span>
                    <span className="text-text-muted text-[13px]">{formatExercises(exercisesCount)}</span>
                </div>
                <button
                    onClick={() => navigate('/exercises/create')}
                    className="group w-10 h-10 hover:w-33 rounded-xl bg-accent text-on-accent flex items-center justify-center text-[15px] font-bold cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.95] overflow-hidden"
                >
                    <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 group-hover:max-w-30 group-hover:opacity-100">
                        Pridať cvik
                    </span>
                    <span className="m-1">+</span>
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
                {categoryFilters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => {
                            setSelectedCategory(filter)
                            setSelectedMuscleGroup(ALL_FILTER)
                            setExercises([])
                        }}
                        className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                            selectedCategory === filter
                                ? 'bg-chip border-2 border-accent text-accent'
                                : 'bg-chip border border-white/10 text-text-secondary'
                        }`}
                    >
                        {filter === CATEGORY_ALL ? 'Všetko' : filter}
                    </button>
                ))}
            </div>

            {selectedCategory !== CATEGORY_ALL && muscleGroupFilterOptions.length > 2 && (
                <div className="flex gap-2 px-5 mt-3 pb-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                    {muscleGroupFilterOptions.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setSelectedMuscleGroup(filter)}
                            className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                                selectedMuscleGroup === filter
                                    ? 'bg-chip border-2 border-accent text-accent'
                                    : 'bg-chip border border-white/10 text-text-secondary'
                            }`}
                        >
                            {muscleGroupFilterLabel[filter]}
                        </button>
                    ))}
                </div>
            )}

            <div className="px-5 mt-2">
                {exercises.map((exercise) => (
                    <ExerciseRow
                        key={exercise.id}
                        name={exercise.name}
                        muscleGroup={exercise.muscleGroup}
                        equipment={exercise.equipment}
                        lastDate={exercise.lastDate}
                        lastWeight={exercise.lastWeight}
                        onClick={() => navigate(`/exercises/${exercise.id}`)}
                    />
                ))}
                {hasMore && <div ref={sentinelRef} className="h-4" />}
            </div>

            {!loading && exercises.length === 0 && (
                <div className="flex flex-1 justify-center items-center text-text-muted font-medium">
                    Zoznam cvikov je prázdny
                </div>
            )}

            {loading && hasMore && (
                <div className="flex flex-1 justify-center items-center py-4">
                    <div className="w-12 h-12 rounded-full border-3 border-white/10 border-t-accent animate-spin" />
                </div>
            )}

            <BottomNav />
        </div>
    )
}

export default ExercisesListPage
