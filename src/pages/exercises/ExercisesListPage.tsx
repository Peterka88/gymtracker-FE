import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav.tsx";
import SearchIcon from "../../components/icons/SearchIcon.tsx";
import ExerciseRow from "./ExerciseRow.tsx";
import {type Exercise, type MuscleGroup, muscleGroupLabel} from "../../types/Exercises.ts";
import {exerciseApi} from "../../api/exercisesApi.ts";

const ALL_FILTER = 'ALL' as const;
type MuscleGroupFilter = typeof ALL_FILTER | MuscleGroup;

const muscleGroupFilters: MuscleGroupFilter[] = [ALL_FILTER, ...Object.keys(muscleGroupLabel) as MuscleGroup[]]

const muscleGroupFilterLabel: Record<MuscleGroupFilter, string> = {
    [ALL_FILTER]: 'Všetko',
    ...muscleGroupLabel,
}

function ExercisesListPage() {

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<MuscleGroupFilter>(ALL_FILTER);
    const [exercises, setExercises] = useState<Exercise[]>([])

    const loadingRef = useRef(false);
    const [hasMore, setHasMore] = useState(true);
    const [page,setPage] = useState(0);
    const size = 10;
    const sentinelRef = useRef<HTMLDivElement>(null)

    const loadNextPage = () => {
        if (loadingRef.current || !hasMore) return
        loadingRef.current = true
        exerciseApi.getExercises(page, size)
            .then((data) => {
                setExercises((curr) => [...curr, ...data.content])
                setHasMore(!data.last)
                setPage((p) => p + 1)
            }).finally(() => loadingRef.current = false)
    }

    const filteredExercises = exercises
        .filter((exercise) => selectedFilter === ALL_FILTER || exercise.muscleGroup === selectedFilter)
        .filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()))

    useEffect(() => loadNextPage(),[])

    useEffect(() => {
        const node = sentinelRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadNextPage()
            },
            { rootMargin: '200px' }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [page, hasMore, loadingRef]);

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
                        equipment={exercise.equipment}
                        lastDate={exercise.lastDate}
                        lastWeight={exercise.lastWeight} />
                ))}
                {hasMore && <div ref={sentinelRef} className="h-4" />}
            </div>

            {loadingRef && hasMore && (
                <div className="flex flex-1 justify-center items-center py-4">
                    <div className="w-12 h-12 rounded-full border-3 border-white/10 border-t-accent animate-spin" />
                </div>
            )}

            <BottomNav />
        </div>
    )
}

export default ExercisesListPage
