import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

type SetStatus = 'done' | 'pr' | 'pending'
type SetRow = { series: number; kg: number; reps: number; status: SetStatus }
type Exercise = { id: string; name: string; pr: boolean; expanded: boolean; sets: SetRow[]; notes: string }

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

function Stepper({
    label,
    value,
    onChange,
    color,
    allowDecimals = true,
}: {
    label: string
    value: number
    onChange: (value: number) => void
    color: string
    allowDecimals?: boolean
}) {
    const [text, setText] = useState(String(value));

    function commit(newValue: number) {
        const rounded = allowDecimals ? Math.round(newValue * 100) / 100 : Math.round(newValue);
        onChange(rounded);
        setText(String(rounded));
    }

    function handleTextChange(raw: string) {
        const normalized = raw.replace(',', '.');
        const pattern = allowDecimals ? /^\d*\.?\d{0,2}$/ : /^\d*$/;
        if (normalized === '' || pattern.test(normalized)) {
            setText(raw);
            const parsed = parseFloat(normalized);
            if (!isNaN(parsed)) {
                onChange(parsed);
            }
        }
    }

    return (
        <div className="flex-1">
            <div className={`text-[11px] font-bold text-center mb-2 ${color}`}>{label}</div>
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => commit(Math.max(0, value - 1))}
                    className="w-8 h-8 rounded-full bg-btn border border-white/10 flex items-center justify-center text-lg cursor-pointer"
                >
                    −
                </button>
                <input
                    type="text"
                    inputMode={allowDecimals ? 'decimal' : 'numeric'}
                    value={text}
                    onChange={(event) => handleTextChange(event.target.value)}
                    onBlur={() => setText(String(value))}
                    className="text-[20px] font-extrabold w-16 text-center bg-transparent outline-none"
                />
                <button
                    onClick={() => commit(value + 1)}
                    className="w-8 h-8 rounded-full bg-btn border border-white/10 flex items-center justify-center text-lg cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    )
}

function ExerciseCard({
    exercise,
    onToggle,
    onAddSet,
    onEditSet,
    onNotesChange,
}: {
    exercise: Exercise
    onToggle: () => void
    onAddSet: (kg: number, reps: number) => void
    onEditSet: (series: number, kg: number, reps: number) => void
    onNotesChange: (notes: string) => void
}) {
    const doneCount = exercise.sets.filter((set) => set.status !== 'pending').length;
    const allDone = doneCount === exercise.sets.length;
    const lastSet = exercise.sets[exercise.sets.length - 1];

    const [addingSet, setAddingSet] = useState(false);
    const [draftKg, setDraftKg] = useState(lastSet?.kg ?? 0);
    const [draftReps, setDraftReps] = useState(lastSet?.reps ?? 0);

    const [editingSeries, setEditingSeries] = useState<number | null>(null);
    const [editDraftKg, setEditDraftKg] = useState(0);
    const [editDraftReps, setEditDraftReps] = useState(0);

    function openAddSet() {
        setEditingSeries(null);
        setDraftKg(lastSet?.kg ?? 0);
        setDraftReps(lastSet?.reps ?? 0);
        setAddingSet(true);
    }

    function confirmAddSet() {
        onAddSet(draftKg, draftReps);
        setAddingSet(false);
    }

    function openEditSet(set: SetRow) {
        setAddingSet(false);
        setEditingSeries(set.series);
        setEditDraftKg(set.kg);
        setEditDraftReps(set.reps);
    }

    function confirmEditSet() {
        if (editingSeries !== null) {
            onEditSet(editingSeries, editDraftKg, editDraftReps);
        }
        setEditingSeries(null);
    }

    return (
        <div className="mx-5 mt-3 first:mt-4 p-4 bg-card border border-white/[0.07] rounded-2xl">
            <div onClick={onToggle} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-1.5 text-[14.5px] font-extrabold">
                    {exercise.name}
                    {exercise.pr && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-carbs/[0.16] text-carbs text-[9.5px] font-extrabold">
                            🏆 PR
                        </span>
                    )}
                </div>
                <span className={`text-[11.5px] font-bold flex items-center gap-1 ${allDone ? 'text-accent' : 'text-text-muted'}`}>
                    {doneCount} / {exercise.sets.length}
                    {allDone && ' ✓'}
                    <span className={`inline-block transition-transform duration-200 ${exercise.expanded ? 'rotate-90' : ''}`}>
                        ›
                    </span>
                </span>
            </div>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    exercise.expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="pt-2.5">
                        <div className="flex text-text-faint text-[10.5px] font-bold uppercase tracking-[0.05em] px-1 pb-1.5">
                            <span className="w-10">Séria</span>
                            <span className="flex-1 text-center">Kg</span>
                            <span className="flex-1 text-center">Opak.</span>
                            <span className="w-8 text-right">✓</span>
                        </div>

                        {exercise.sets.map((set) =>
                            editingSeries === set.series ? (
                                <div key={set.series} className="mt-1.5 mb-1.5 p-4 bg-btn border border-white/[0.07] rounded-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-text-faint text-[11px] font-bold tracking-wider uppercase">
                                            Upraviť sériu · {set.series}
                                        </div>
                                        <button
                                            onClick={() => setEditingSeries(null)}
                                            className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-text-muted text-xs cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="flex gap-4">
                                        <Stepper label="Váha (kg)" value={editDraftKg} onChange={setEditDraftKg} color="text-protein" />
                                        <Stepper label="Opakovania" value={editDraftReps} onChange={setEditDraftReps} color="text-fat" allowDecimals={false} />
                                    </div>
                                    <button
                                        onClick={confirmEditSet}
                                        className="w-full mt-4 bg-accent text-on-accent rounded-2xl py-3 text-[14px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                                    >
                                        Uložiť sériu
                                    </button>
                                </div>
                            ) : (
                                <div
                                    key={set.series}
                                    onClick={() => openEditSet(set)}
                                    className={`flex items-center text-[13.5px] px-1 py-2 rounded-lg cursor-pointer ${
                                        set.status === 'pr'
                                            ? 'bg-carbs/[0.08] border border-carbs/[0.22]'
                                            : ''
                                    }`}
                                >
                                    <span className="w-10 font-bold flex items-center gap-1">
                                        {set.series}
                                        {set.status === 'pr' && <span className="text-[11px]">🏆</span>}
                                    </span>
                                    <span className={`flex-1 text-center ${set.status === 'pr' ? 'font-bold text-carbs' : ''}`}>
                                        {set.kg}
                                    </span>
                                    <span className="flex-1 text-center">{set.reps}</span>
                                    <span className="w-8 text-right">
                                        {set.status === 'pending' ? (
                                            <span className="text-text-faint">○</span>
                                        ) : (
                                            <span className="text-accent font-extrabold">✓</span>
                                        )}
                                    </span>
                                </div>
                            )
                        )}

                        {addingSet ? (
                            <div className="mt-2 p-4 bg-btn border border-white/[0.07] rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-text-faint text-[11px] font-bold tracking-[0.05em] uppercase">
                                        Nová séria · {exercise.sets.length + 1}
                                    </div>
                                    <button
                                        onClick={() => setAddingSet(false)}
                                        className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-text-muted text-xs cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <Stepper label="Váha (kg)" value={draftKg} onChange={setDraftKg} color="text-protein" />
                                    <Stepper label="Opakovania" value={draftReps} onChange={setDraftReps} color="text-fat" allowDecimals={false} />
                                </div>
                                <button
                                    onClick={confirmAddSet}
                                    className="w-full mt-4 bg-accent text-on-accent rounded-2xl py-3 text-[14px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer"
                                >
                                    + Pridať sériu
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={openAddSet}
                                className="w-full mt-1.5 py-2 rounded-lg border border-dashed border-white/[0.18] text-text-secondary text-[12.5px] font-bold cursor-pointer"
                            >
                                + Pridať sériu
                            </button>
                        )}

                        <textarea
                            value={exercise.notes}
                            onChange={(event) => onNotesChange(event.target.value)}
                            placeholder="Poznámka k cviku (napr. nabudúce pridať váhu)"
                            rows={2}
                            className="w-full mt-2.5 bg-btn border border-white/[0.07] rounded-lg px-3 py-2 text-[12.5px] text-text-primary placeholder:text-text-faint outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

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
                    onClick={() => navigate('/workout')}
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
