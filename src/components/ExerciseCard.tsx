import Stepper from "./Stepper.tsx";
import {useState} from "react";
import type {UiSessionExercise, UiWorkoutSet} from "../pages/ActiveWorkoutPage.tsx";
import {formatSeries} from "../utils/formatSeries.ts";


function ExerciseCard({ exercise, onToggle, onAddSet, onEditSet, onNotesChange }: {
    exercise: UiSessionExercise
    onToggle: () => void
    onAddSet: (weight: number, reps: number) => void
    onEditSet: (setIndex: number, weight: number, reps: number) => void
    onNotesChange: (note: string) => void
}) {
    const hasPr = exercise.workoutSets.some((set) => set.pr);
    const lastSet = exercise.workoutSets[exercise.workoutSets.length - 1];

    const [addingSet, setAddingSet] = useState(false);
    const [draftWeight, setDraftWeight] = useState(lastSet?.weight ?? 0);
    const [draftReps, setDraftReps] = useState(lastSet?.reps ?? 0);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editDraftWeight, setEditDraftWeight] = useState(0);
    const [editDraftReps, setEditDraftReps] = useState(0);

    function openAddSet() {
        setEditingIndex(null);
        setDraftWeight(lastSet?.weight ?? 0);
        setDraftReps(lastSet?.reps ?? 0);
        setAddingSet(true);
    }

    function confirmAddSet() {
        onAddSet(draftWeight, draftReps);
        setAddingSet(false);
    }

    function openEditSet(set: UiWorkoutSet, index: number) {
        setAddingSet(false);
        setEditingIndex(index);
        setEditDraftWeight(set.weight);
        setEditDraftReps(set.reps);
    }

    function confirmEditSet() {
        if (editingIndex !== null) {
            onEditSet(editingIndex, editDraftWeight, editDraftReps);
        }
        setEditingIndex(null);
    }

    return (
        <div className="mx-5 mt-3 first:mt-4 p-4 bg-card border border-white/[0.07] rounded-2xl">
            <div onClick={onToggle} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-1.5 text-[14.5px] font-extrabold">
                    {exercise.exerciseName}
                    {hasPr && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-carbs/[0.16] text-carbs text-[9.5px] font-extrabold">
                            🏆 PR
                        </span>
                    )}
                </div>
                <span className={`text-[11.5px] font-bold flex items-center gap-1 'text-text-muted'`}>
                    {formatSeries(exercise.workoutSets.length)}
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
                        <div className="grid grid-cols-3 text-text-faint text-[10.5px] font-bold uppercase tracking-[0.05em] px-1 pb-1.5">
                            <span className="text-center">Séria</span>
                            <span className="text-center">Kg</span>
                            <span className="text-center">Opak</span>
                        </div>

                        {exercise.workoutSets.map((set, index) =>
                            editingIndex === index ? (
                                <div key={set.id} className="mt-1.5 mb-1.5 p-4 bg-btn border border-white/[0.07] rounded-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-text-faint text-[11px] font-bold tracking-wider uppercase">
                                            Upraviť sériu · {index + 1}
                                        </div>
                                        <button
                                            onClick={() => setEditingIndex(null)}
                                            className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-text-muted text-xs cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="flex gap-4">
                                        <Stepper label="Váha (kg)" value={editDraftWeight} onChange={setEditDraftWeight} color="text-protein" />
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
                                    key={ set.id }
                                    onClick={() => openEditSet(set, index)}
                                    className={`grid grid-cols-3 items-center text-[13.5px] px-1 py-2 cursor-pointer rounded-lg ${
                                        set.pr
                                            ? 'bg-carbs/[0.16]'
                                            : ''
                                    }`}
                                >
                                    <span className="font-bold flex justify-center items-center gap-1">
                                        {index + 1}
                                        {set.pr && <span className="text-[12px]">🏆</span>}
                                    </span>
                                    <span className={`text-center ${set.pr ? 'font-bold text-carbs' : ''}`}>
                                        {set.weight}
                                    </span>
                                    <span className="text-center">{set.reps}</span>
                                </div>
                            )
                        )}

                        { addingSet ? (
                            <div className="mt-2 p-4 bg-btn border border-white/[0.07] rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-text-faint text-[11px] font-bold tracking-[0.05em] uppercase">
                                        Nová séria · {exercise.workoutSets.length + 1}
                                    </div>
                                    <button
                                        onClick={() => setAddingSet(false)}
                                        className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-text-muted text-xs cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <Stepper label="Váha (kg)" value={draftWeight} onChange={setDraftWeight} color="text-protein" />
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
                            value={exercise.note}
                            onChange={(event) => onNotesChange(event.target.value)}
                            placeholder="+ Pridať poznámku"
                            rows={2}
                            className="w-full mt-2.5 bg-btn border border-white/[0.07] rounded-lg px-3 py-2 text-[12.5px] text-text-primary placeholder:text-text-faint outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExerciseCard;
