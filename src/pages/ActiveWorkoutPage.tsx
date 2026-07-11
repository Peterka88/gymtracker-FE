import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ExerciseCard from "../components/ExerciseCard.tsx";

type SetStatus = 'done' | 'pr' | 'pending'
export type SetRow = { series: number; kg: number; reps: number; status: SetStatus }
export type Exercise = { id: string; name: string; pr: boolean; expanded: boolean; sets: SetRow[]; notes: string }

const initialExercises: Exercise[] = [
    {
        id: 'bench-press',
        name: 'Bench press',
        pr: true,
        expanded: true,
        notes: '',
        sets: [
            { series: 1, kg: 60, reps: 10, status: 'done' },
            { series: 2, kg: 70, reps: 8, status: 'pr' },
            { series: 3, kg: 70, reps: 8, status: 'done' },
            { series: 4, kg: 60, reps: 10, status: 'pending' },
        ],
    },
    {
        id: 'sklonene-tlaky',
        name: 'Sklon. tlaky s činkami',
        pr: false,
        expanded: false,
        notes: '',
        sets: [
            { series: 1, kg: 22, reps: 10, status: 'done' },
            { series: 2, kg: 22, reps: 10, status: 'done' },
            { series: 3, kg: 22, reps: 9, status: 'done' },
        ],
    },
    {
        id: 'tlaky-nad-hlavu',
        name: 'Tlaky nad hlavu',
        pr: false,
        expanded: false,
        notes: '',
        sets: [
            { series: 1, kg: 30, reps: 10, status: 'pending' },
            { series: 2, kg: 30, reps: 10, status: 'pending' },
            { series: 3, kg: 30, reps: 10, status: 'pending' },
        ],
    },
]

function ActiveWorkoutPage() {

    const navigate = useNavigate();
    const [workoutName, setWorkoutName] = useState('Nový tréning');
    const [workoutNotes, setWorkoutNotes] = useState('');
    const [exercises, setExercises] = useState(initialExercises);

    function toggleExpanded(id: string) {
        setExercises((current) =>
            current.map((exercise) => (exercise.id === id ? { ...exercise, expanded: !exercise.expanded } : exercise))
        );
    }

    function updateExerciseNotes(id: string, notes: string) {
        setExercises((current) =>
            current.map((exercise) => (exercise.id === id ? { ...exercise, notes } : exercise))
        );
    }

    function addSet(id: string, kg: number, reps: number) {
        setExercises((current) =>
            current.map((exercise) => {
                if (exercise.id !== id) return exercise;
                return {
                    ...exercise,
                    sets: [
                        ...exercise.sets,
                        {
                            series: exercise.sets.length + 1,
                            kg,
                            reps,
                            status: 'pending',
                        },
                    ],
                };
            })
        );
    }

    function editSet(id: string, series: number, kg: number, reps: number) {
        setExercises((current) =>
            current.map((exercise) => {
                if (exercise.id !== id) return exercise;
                return {
                    ...exercise,
                    sets: exercise.sets.map((set) => (set.series === series ? { ...set, kg, reps } : set)),
                };
            })
        );
    }

    const completedExercisesCount = exercises.filter((exercise) =>
        exercise.sets.every((set) => set.status !== 'pending')
    ).length;
    const exerciseProgressPercent = (completedExercisesCount / exercises.length) * 100;

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
                        value={workoutName}
                        onChange={(event) => setWorkoutName(event.target.value)}
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

            <div className="mx-5 p-4 bg-card border border-white/[0.07] rounded-2xl">
                <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[14px] font-extrabold">Postup tréningu</span>
                    <span className="text-[13px]">
                        <span className="font-extrabold">{completedExercisesCount}</span>
                        <span className="text-protein font-semibold"> / {exercises.length} cviky</span>
                    </span>
                </div>
                <div className="h-2 rounded-full bg-track overflow-hidden">
                    <div
                        className="h-full rounded-full bg-accent transition-[width] duration-300"
                        style={{ width: `${exerciseProgressPercent}%` }}
                    />
                </div>
            </div>

            {exercises.map((exercise) => (
                <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onToggle={() => toggleExpanded(exercise.id)}
                    onAddSet={(kg, reps) => addSet(exercise.id, kg, reps)}
                    onEditSet={(series, kg, reps) => editSet(exercise.id, series, kg, reps)}
                    onNotesChange={(notes) => updateExerciseNotes(exercise.id, notes)}
                />
            ))}

            <div className="mx-5 mt-4">
                <div className="text-text-faint text-[11px] font-bold tracking-[0.05em] uppercase mb-1.5">
                    Poznámky k tréningu
                </div>
                <textarea
                    value={workoutNotes}
                    onChange={(event) => setWorkoutNotes(event.target.value)}
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
                    className="w-full bg-accent text-on-accent rounded-2xl py-4 text-[14.5px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                >
                    Ukončiť tréning
                </button>
            </div>

            <BottomNav />
        </div>
    )
}

export default ActiveWorkoutPage
