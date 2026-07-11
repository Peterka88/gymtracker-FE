import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ExerciseCard from "../components/ExerciseCard.tsx";
import type {SessionExercise, WorkoutSessionDetail, WorkoutSet} from "../types/WorkoutSessionDetail.ts";

export type UiWorkoutSet = Omit<WorkoutSet, 'id'> & {
    id: number | null
}

export type UiSessionExercise = Omit<SessionExercise, 'workoutSets'> & {
    expanded: boolean
    workoutSets: UiWorkoutSet[]
}

type UiWorkoutSession = Omit<WorkoutSessionDetail, 'sessionExercises'> & {
    id: number
    sessionExercises: UiSessionExercise[]
}

const dummySession: UiWorkoutSession = {
    id: 1,
    name: 'Push Day',
    startedAt: new Date().toISOString(),
    duration: 0,
    note: '',
    pr: false,
    sessionExercises: [
        {
            id: 1,
            exerciseId: 101,
            exerciseName: 'Bench press',
            orderIndex: 0,
            note: '',
            expanded: true,
            workoutSets: [
                { id: 1, weight: 60, reps: 10, pr: false },
                { id: 2, weight: 65, reps: 8, pr: true },
                { id: 3, weight: 65, reps: 8, pr: false },
            ],
        },
        {
            id: 2,
            exerciseId: 102,
            exerciseName: 'Shoulder press',
            orderIndex: 1,
            note: '',
            expanded: false,
            workoutSets: [
                { id: 4, weight: 30, reps: 12, pr: false },
                { id: 5, weight: 32, reps: 10, pr: false },
            ],
        },
        {
            id: 3,
            exerciseId: 103,
            exerciseName: 'Tricep pushdown',
            orderIndex: 2,
            note: '',
            expanded: false,
            workoutSets: [],
        },
    ],
}

function ActiveWorkoutPage() {

    const navigate = useNavigate();
    const [session, setSession] = useState<UiWorkoutSession | null>(dummySession);

    const exercises = session?.sessionExercises ?? [];

    function updateWorkoutName(name: string) {
        setSession((current) => (current ? { ...current, name } : current));
    }

    function updateWorkoutNote(note: string) {
        setSession((current) => (current ? { ...current, note } : current));
    }

    function toggleExpanded(exerciseId: number) {
        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.map((exercise) =>
                    exercise.id === exerciseId ? { ...exercise, expanded: !exercise.expanded } : exercise
                ),
            };
        });
    }

    function updateExerciseNote(exerciseId: number, note: string) {
        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.map((exercise) =>
                    exercise.id === exerciseId ? { ...exercise, note } : exercise
                ),
            };
        });
    }

    function addSet(exerciseId: number, weight: number, reps: number) {
        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.map((exercise) => {
                    if (exercise.id !== exerciseId) return exercise;
                    const newSet: UiWorkoutSet = { id: null, weight, reps, pr: false };
                    return { ...exercise, workoutSets: [...exercise.workoutSets, newSet] };
                }),
            };
        });
    }

    function editSet(exerciseId: number, setIndex: number, weight: number, reps: number) {
        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.map((exercise) => {
                    if (exercise.id !== exerciseId) return exercise;
                    return {
                        ...exercise,
                        workoutSets: exercise.workoutSets.map((set, index) =>
                            index === setIndex ? { ...set, weight, reps } : set
                        ),
                    };
                }),
            };
        });
    }

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between px-5 pt-1.5 pb-3">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-xl cursor-pointer"
                >
                    ‹
                </button>
                <div className="text-center">
                    <input
                        value={session?.name ?? ''}
                        onChange={(event) => updateWorkoutName(event.target.value)}
                        className="text-[16px] font-extrabold text-center bg-transparent outline-none w-[170px]"
                    />
                    <div className="text-accent text-[11.5px] font-bold flex items-center gap-1.5 justify-center mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> 48:12
                    </div>
                </div>
                <button className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-muted text-base cursor-pointer">
                    ⋯
                </button>
            </div>

            {exercises.map((exercise) => (
                <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onToggle={() => toggleExpanded(exercise.id)}
                    onAddSet={(weight, reps) => addSet(exercise.id, weight, reps)}
                    onEditSet={(setIndex, weight, reps) => editSet(exercise.id, setIndex, weight, reps)}
                    onNotesChange={(note) => updateExerciseNote(exercise.id, note)}
                />
            ))}

            <div className="mx-5 mt-4">
                <div className="text-text-faint text-[11px] font-bold tracking-[0.05em] uppercase mb-1.5">
                    Poznámky k tréningu
                </div>
                <textarea
                    value={session?.note ?? ''}
                    onChange={(event) => updateWorkoutNote(event.target.value)}
                    placeholder="Ako prebiehal tréning?"
                    rows={3}
                    className="w-full bg-card border border-white/[0.07] rounded-2xl px-4 py-3 text-[13.5px] text-text-primary placeholder:text-text-faint outline-none resize-none"
                />
            </div>

            <div className="px-5 mt-4">
                <button
                    onClick={() => navigate('/workout/add-exercise')}
                    className="w-full py-3.5 rounded-2xl border border-dashed border-white/[0.18] text-text-secondary text-[13.5px] font-bold cursor-pointer"
                >
                    + Pridať cvik
                </button>
            </div>

            <div className="px-5 mt-2.5">
                <button
                    onClick={() => navigate('/workout')}
                    className="w-full bg-red-500 text-on-accent rounded-2xl py-4 text-[14.5px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                >
                    Ukončiť tréning
                </button>
            </div>

            <BottomNav />
        </div>
    )
}

export default ActiveWorkoutPage
