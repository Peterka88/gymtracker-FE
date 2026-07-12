import type {SessionExercise} from "../types/workout.ts";
import {formatSeries} from "../utils/formatSeries.ts";


function WorkoutSummaryCard(exercise: SessionExercise) {
    const pr = exercise.workoutSets.some((set) => set.pr)

    return(
        <div className="mt-3 first:mt-4 p-4 bg-card border border-white/[0.07] rounded-2xl">
            <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-1.5 text-[14.5px] font-extrabold">
                    {exercise.exerciseName}
                    {pr && (
                        <span className="px-1.5 py-0.5 items-center bg-carbs/[0.16] rounded-md text-carbs text-[9.5px] font-extrabold">🏆 PR</span>
                    )}
                </div>
                <span className="text-text-muted text-[11.5px] flex font-bold items-center gap-1">{formatSeries(exercise.workoutSets.length)}</span>
            </div>
            <div className="grid">
                <div className="pt-2 grid grid-cols-3 text-text-faint text-[12px] font-bold uppercase tracking-[0.05em] px-1 pb-1.5">
                    <span className="text-center">Séria</span>
                    <span className="text-center">Kg</span>
                    <span className="text-center">Opak</span>
                </div>

                { exercise.workoutSets.map((set, i) => (
                    <div key={set.id} className={`grid grid-cols-3 items-center text-[13.5px] px-1 py-1 rounded-lg
                        ${set.pr ? 'bg-carbs/[0.16] text-carbs font-extrabold' : ''}`}>
                        <span className="flex items-center justify-center gap-1">
                            {i+1}
                            {set.pr && <span className={"text-[12px]"}>🏆</span>}
                        </span>
                        <span className="text-center">{set.weight}</span>
                        <span className="text-center">{set.reps}</span>
                    </div>
                ))}

                <span className="mt-2 border border-white/[0.07]"></span>

                <div className={"mt-3 flex flex-col"}>
                    <span className="text-text-faint text-[11px] font-bold uppercase tracking-[0.05em] px-1 pb-1.5">Poznámka</span>
                    <textarea readOnly
                              className={`w-full placeholder:text-text-faint ${!exercise.note ? 'italic' : '' } px-1 text-[12.5px] resize-none outline-none text-text-primary`}
                              placeholder="＋ Pridať `poznámku"
                              value={exercise.note}
                    />
                </div>

            </div>
        </div>
    )
}


export default WorkoutSummaryCard;