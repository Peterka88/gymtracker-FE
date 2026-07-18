import { useEffect, useRef, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ExerciseCard from "../components/ExerciseCard.tsx";
import type {SessionExercise, WorkoutSessionDetail, WorkoutSet} from "../types/workout.ts";
import ClockIcon from "../components/icons/ClockIcon.tsx";
import BarbellIcon from "../components/icons/BarbellIcon.tsx";
import {workoutApi} from "../api/workoutApi.ts";
import TrashIcon from "../components/icons/TrashIcon.tsx";
import ConfirmDialog from "../components/ConfirmDialog.tsx";

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

interface StoredTimer {
    accumulatedSeconds: number
    resumedAt: number | null
}

const timerStorageKey = (sessionId: string) => `activeWorkoutTimer:${sessionId}`;

function loadTimer(sessionId: string): StoredTimer {
    const raw = localStorage.getItem(timerStorageKey(sessionId));
    if (raw) return JSON.parse(raw);
    return { accumulatedSeconds: 0, resumedAt: Date.now() };
}

function saveTimer(sessionId: string, timer: StoredTimer) {
    localStorage.setItem(timerStorageKey(sessionId), JSON.stringify(timer));
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
    const timerRef = useRef<StoredTimer | null>(null);
    const nameBeforeEditRef = useRef('');

    const [menuOpen, setMenuOpen] = useState(false)
    const [deleteSessionDialog, setDeleteSessionDialog] = useState(false)

    useEffect(() => {
        if (id) {
            workoutApi.getById(Number(id)).then((data) => {
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
            workoutApi.create().then(data => {
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
        if (!id) return;
        const timer = loadTimer(id);
        saveTimer(id, timer);
        timerRef.current = timer;
        setTimerRunning(timer.resumedAt !== null);
    }, [id]);

    useEffect(() => {
        const update = () => {
            const timer = timerRef.current;
            if (!timer) return;
            const runningSeconds = timer.resumedAt !== null ? (Date.now() - timer.resumedAt) / 1000 : 0;
            setElapsedSeconds(Math.floor(timer.accumulatedSeconds + runningSeconds));
        };
        update();
        if (!timerRunning) return;
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [timerRunning, id]);

    function toggleTimer() {
        const timer = timerRef.current;
        if (!id || !timer) return;
        const next: StoredTimer = timer.resumedAt !== null
            ? { accumulatedSeconds: timer.accumulatedSeconds + (Date.now() - timer.resumedAt) / 1000, resumedAt: null }
            : { accumulatedSeconds: timer.accumulatedSeconds, resumedAt: Date.now() };
        timerRef.current = next;
        saveTimer(id, next);
        setTimerRunning(next.resumedAt !== null);
    }

    const exercises = session?.sessionExercises ?? [];

    function updateWorkoutName(name: string) {
        setSession((current) => (current ? { ...current, name } : current));
    }

    function updateWorkoutNote(note: string) {
        setSession((current) => (current ? { ...current, note } : current));
    }

    function saveWorkoutNote(note: string) {
        if (!session) return;
        workoutApi.updateWorkoutNameOrNote(session.id, note, null).catch(() => {});
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

    function saveExerciseNote(exerciseSessionId: number, note: string) {
        workoutApi.updateExerciseNote(exerciseSessionId, note).catch(() => {});
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

        workoutApi.addSet(weight, reps, exerciseId)
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
                                workoutSets: exercise.workoutSets.filter((set) => set.id !== tempId)
                            }
                        })
                    }
                })
        })
    }

    function editSet(exerciseSessionId: number, editingIndex: number, setId: number | null, weight: number, reps: number) {
        const previousSet = session?.sessionExercises
            .find((exercise) => exercise.id === exerciseSessionId)
            ?.workoutSets[editingIndex];

        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.map((exercise) => {
                    if (exercise.id !== exerciseSessionId) return exercise;
                    return {
                        ...exercise,
                        workoutSets: exercise.workoutSets.map((set, index) =>
                            index === editingIndex ? { ...set, weight, reps } : set
                        ),
                    };
                }),
            };
        });

        if (setId !== null){
            workoutApi.editSet(weight, reps, setId).then((data)  => {
                setSession((current) => {
                    if (!current) return current;
                    return {
                        ...current,
                        sessionExercises: current.sessionExercises.map((exercise) => {
                            if (exercise.id !== exerciseSessionId) return exercise;
                            return {
                                ...exercise,
                                workoutSets: exercise.workoutSets.map((set,index) =>
                                    index === editingIndex ? { ...set, pr: data.pr } : set
                                )
                            }
                        })
                    }
                })
            }).catch(() => {
                if (!previousSet) return;
                setSession((current) => {
                    if (!current) return current;
                    return {
                        ...current,
                        sessionExercises: current.sessionExercises.map((exercise) => {
                            if (exercise.id !== exerciseSessionId) return exercise;
                            return {
                                ...exercise,
                                workoutSets: exercise.workoutSets.map((set, index) =>
                                    index === editingIndex ? previousSet : set
                                ),
                            };
                        }),
                    };
                });
            })
        }
    }

    function onNameFocus(name: string) {
        nameBeforeEditRef.current = name;
    }

    function onNameBlur(name: string) {
        if (!session) return;
        const previousName = nameBeforeEditRef.current;

        if (previousName === name) return;

        workoutApi.updateWorkoutNameOrNote(session.id, null, name).catch(() => {
            setSession((current) => (current ? { ...current, name: previousName } : current));
        });
    }

    function deleteSet(exerciseSessionId: number, deletingIndex: number, setId: number | null) {
        const deletingSet = session?.sessionExercises
            .find((exercise) => exercise.id === exerciseSessionId)?.workoutSets[deletingIndex]

        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.map((exercise) => {
                    if (exercise.id !== exerciseSessionId) return exercise;
                    return {
                        ...exercise,
                        workoutSets: exercise.workoutSets.filter((_, index) => index !== deletingIndex)
                    };
                })
            };
        })

        if (setId !== null) {
            workoutApi.deleteSet(setId).catch(() => {
                if (!deletingSet) return;
                setSession((current) => {
                    if (!current) return current;
                    return {
                        ...current,
                        sessionExercises: current.sessionExercises.map((exercise) => {
                            if (exercise.id !== exerciseSessionId) return exercise;
                            const workoutSets = [...exercise.workoutSets];
                            workoutSets.splice(deletingIndex, 0, deletingSet);
                            return { ...exercise, workoutSets };
                        })
                    };
                });
            });
        }
    }

    function deleteExercise(exerciseId: number) {
        const previousExercises = session?.sessionExercises;

        setSession((current) => {
            if (!current) return current;
            return {
                ...current,
                sessionExercises: current.sessionExercises.filter((exercise) => exercise.id !== exerciseId)
            };
        });

        workoutApi.deleteExercise(exerciseId).catch(() => {
            if (!previousExercises) return;
            setSession((current) => (current ? { ...current, sessionExercises: previousExercises } : current));
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
                        onFocus={(event) => onNameFocus(event.target.value)}
                        onBlur={(event) => onNameBlur(event.target.value)}
                        onChange={(event) => updateWorkoutName(event.target.value)}
                        className="text-[16px] font-extrabold text-center bg-transparent outline-none w-[170px]"
                    />
                </div>
                <div className={"relative"}>
                    <button
                        onClick={() => setMenuOpen((open) => !open)}
                        className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-base cursor-pointer">
                        ⋯
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-[46px] w-48 bg-card border border-white/[0.07] rounded-xl overflow-hidden z-10 shadow-lg">
                            <button onClick={() => {
                                setDeleteSessionDialog(true)
                                setMenuOpen(false)
                            }}
                                    className="w-full flex items-center gap-2 text-left px-4 py-3 text-[13.5px] font-semibold text-red-500 hover:bg-btn cursor-pointer"
                            >
                                <TrashIcon size={14} />
                                Zrušiť tréning
                            </button>
                        </div>
                    )}
                </div>
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
                            onClick={toggleTimer}
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
                    onEditSet={(setIndex,setId,  weight, reps) => editSet(exercise.id, setIndex, setId, weight, reps)}
                    onDeleteSet={(setIndex, setId) => deleteSet(exercise.id, setIndex, setId)}
                    onDeleteExercise={() => deleteExercise(exercise.id)}
                    onNotesBlur={(note) => saveExerciseNote(exercise.id, note)}
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
                    onBlur={(event) => saveWorkoutNote(event.target.value)}
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

            { id && (
                <div className="px-5 mt-2.5">
                    <button
                        onClick={() => {
                            workoutApi.finishWorkout(Number(id))
                            navigate('/workouts')
                            localStorage.removeItem(timerStorageKey(id))
                        }}
                        className="w-full bg-red-500 text-on-accent rounded-2xl py-4 text-[14.5px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                    >
                        Ukončiť tréning
                    </button>
                </div>
            )}

            <BottomNav />

            {deleteSessionDialog && <ConfirmDialog
                title={"Vymazať tréning?"}
                description={"Naozaj chcete vymazať aktívny tréning?"}
                onConfirm={() => workoutApi.deleteWorkout(Number(id))
                    .then(() => navigate("/workouts"))}
                onCancel={() => setDeleteSessionDialog(false)}
                confirmLabel={"Vymazať"}
                cancelLabel={"Zavrieť"}
                confirmColor={"red"} />
                }
        </div>
    )
}

export default ActiveWorkoutPage
