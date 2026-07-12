import { useEffect, useRef, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ExerciseCard from "../components/ExerciseCard.tsx";
import type {SessionExercise, WorkoutSessionDetail, WorkoutSet} from "../types/workout.ts";
import ClockIcon from "../components/icons/ClockIcon.tsx";
import BarbellIcon from "../components/icons/BarbellIcon.tsx";
import {workoutApi} from "../api/workoutApi.ts";

function PauseIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1.2" />
            <rect x="14" y="5" width="4" height="14" rx="1.2" />
        </svg>
    )
}

function PlayIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5z" />
        </svg>
    )
}

function formatElapsed(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const mmss = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return hours > 0 ? `${hours}:${mmss}` : mmss;
}

export type UiWorkoutSet = Omit<WorkoutSet, 'id'> & {
    id: number | null
}

export type UiSessionExercise = Omit<SessionExercise, 'workoutSets'> & {
    expanded: boolean
    workoutSets: UiWorkoutSet[]
}

type UiWorkoutSession = Omit<WorkoutSessionDetail, 'pr' | 'sessionExercises'> & {
    id: number
    sessionExercises: UiSessionExercise[]
}

function ActiveWorkoutPage() {

    const { id } = useParams<{id: string}>()

    const navigate = useNavigate();
    const [session, setSession] = useState<UiWorkoutSession | null>();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(true);
    const creationStarted = useRef(false);

    useEffect(() => {
        if (id) {
            workoutApi.getById(Number(id), 1).then((data) => {
                setSession({
                    ...data,
                    sessionExercises: data.sessionExercises.map((exercise) => ({
                        ...exercise,
                        expanded: false
                    }))
                })
            })
        } else {
            if (creationStarted.current) return;
            creationStarted.current = true;
            workoutApi.create(1).then(data => {
                setSession({
                    ...data,
                    duration: 0,
                    note: '',
                    sessionExercises: []
                })
                navigate(`/workouts/${data.id}/active`, { replace: true })
            })
        }
    }, [id]);


    useEffect(() => {
        if (!timerRunning || !session?.startedAt) return;
        const startMs = new Date(session.startedAt).getTime();
        const update = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [timerRunning, session?.startedAt]);

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

    //  záporné = pending, kladné = uložené
    const tempIdCounter = useRef(-1)

    function addSet(exerciseId: number, weight: number, reps: number) {
        const tempId = tempIdCounter.current--;

        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.map((exercise) => {
                    if (exercise.id !== exerciseId) return exercise;
                    const newSet: UiWorkoutSet = { id: tempId, weight, reps, pr: false };
                    return { ...exercise, workoutSets: [...exercise.workoutSets, newSet] };
                }),
            };
        });

        workoutApi.addSet(weight, reps, exerciseId, 1)
            .then((data) => {
                setSession((current) => {
                    if (!current) return current;
                    return {
                        ...current,
                        sessionExercises: current.sessionExercises.map((exercise) => {
                            if (exercise.id !== exerciseId) return exercise;
                            return {
                                ...exercise,
                                workoutSets: exercise.workoutSets.map((set) => {
                                    if (set.id === tempId) {
                                        return { ...set, id: data.id, pr: data.pr}
                                    }
                                    return set;
                                })
                            }
                        })
                    }
                })
            }).catch(() => {
                setSession((current) => {
                    if (!current) return current;
                    return {
                        ...current,
                        sessionExercises: current.sessionExercises.map((exercise) => {
                            if (exercise.id !== exerciseId) return exercise;
                            return {
                                ...exercise,
                                workoutSets: exercise.workoutSets.filter((_, index) => index !== tempId)
                            }
                        })
                    }
                })
        })
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
                </div>
                <button className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-muted text-base cursor-pointer">
                    ⋯
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mx-5">
                <div className="p-4 bg-card border border-white/[0.07] rounded-2xl">
                    <div className="flex items-center gap-1.5 text-text-muted text-[11.5px] font-bold">
                        <ClockIcon size={14} /> Trvanie
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                        <div
                            className={`flex items-center gap-2 text-[22px] font-extrabold tabular-nums ${
                                timerRunning ? 'text-accent' : 'text-red-500 animate-pulse'
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${timerRunning ? 'bg-accent' : 'bg-red-500'}`}/>
                            {formatElapsed(elapsedSeconds)}
                        </div>
                        <button
                            onClick={() => setTimerRunning((running) => !running)}
                            className="w-8 h-8 rounded-full bg-btn border border-white/10 flex items-center justify-center text-text-secondary cursor-pointer"
                        >
                            {timerRunning ? <PauseIcon /> : <PlayIcon />}
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-card border border-white/[0.07] rounded-2xl">
                    <div className="flex items-center gap-1.5 text-text-muted text-[11.5px] font-bold">
                        <BarbellIcon size={14} /> Cviky
                    </div>
                    <div className="mt-1.5 text-[22px] font-extrabold">
                        {exercises.length}
                        <span className="text-text-muted text-[13px] font-semibold ml-1.5">
                            {exercises.length === 1 ? 'cvik' : exercises.length < 5 && exercises.length > 0 ? 'cviky' : 'cvikov'}
                        </span>
                    </div>
                </div>
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
                    onClick={() => navigate(`/workouts/${session?.id}/add-exercise`)}
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
