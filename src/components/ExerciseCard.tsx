import Stepper from "./Stepper.tsx";
import {useState} from "react";
import type {Exercise, SetRow} from "../pages/ActiveWorkoutPage.tsx";
import {formatSeries} from "../utils/formatSeries.ts";


function ExerciseCard({ exercise, onToggle, onAddSet, onEditSet, onNotesChange }: {
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
                    {formatSeries(exercise.sets.length)}
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

export default ExerciseCard;