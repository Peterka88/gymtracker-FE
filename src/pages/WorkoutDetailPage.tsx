import {useNavigate, useParams} from "react-router-dom";
import type { WorkoutSessionDetail } from "../types/workout.ts";
import {useEffect, useState} from "react";
import {workoutApi} from "../api/workoutApi.ts";
import WorkoutSummaryCard from "../components/WorkoutSummaryCard.tsx";
import BottomNav from "../components/BottomNav.tsx";
import {formatWorkoutDateTime} from "../utils/formatWorkoutDateTime.ts";
import ClockIcon from "../components/icons/ClockIcon.tsx";

function WorkoutDetailPage() {
    const { id } = useParams<{id: string}>()
    const navigate = useNavigate()

    const [workoutDetail, setWorkoutDetail] = useState<WorkoutSessionDetail>()

    useEffect(() => {
       workoutApi.getById(Number(id)).then((data => {
           setWorkoutDetail(data)
       }));
    },[])

    const prCount = workoutDetail?.sessionExercises
        .flatMap((exercise) => exercise.workoutSets)
        .filter((set) => set.pr).length ?? 0

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className={"flex items-center justify-between px-5 pt-1.5 pb-3"}>
                <button
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 justify-center text-xl cursor-pointer"
                    onClick={() => navigate(-1)}>‹</button>
                <div className="text-[16px] font-extrabold">Workout Detail</div>
                <button className="w-[38px] h-[38px] rounded-full text-base bg-btn border text-text-muted border-white/8 justify-center cursor-pointer">
                    ⋯
                </button>
            </div>

            { !workoutDetail ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center justify-center gap-1.5 py-6">
                        <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="px-5 mt-2">
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-3xl text-white">Push deň</span>
                            <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-carbs/[0.16] text-carbs text-[11px] font-extrabold">
                                🏆 PR
                            </span>
                        </div>
                        <div className={"text-text-muted text-[13px] my-2"}>
                            {formatWorkoutDateTime(workoutDetail.startedAt, workoutDetail.duration)}
                        </div>
                    </div>
                    <div className="flex gap-2.5 px-5 pt-2">
                        <div className="flex-1 p-3 bg-card border border-white/[0.07] rounded-2xl">
                            <div className="flex items-center gap-1 text-text-muted text-[11px] font-semibold">
                                <ClockIcon size={12} />
                                Trvanie
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[22px] font-extrabold">{workoutDetail.duration}</span>
                                <span className={"text-text-muted text-[11px] font-semibold"}>min</span>
                            </div>
                        </div>
                        <div className="flex-1 p-3 bg-carbs/[0.08] border border-carbs/[0.22] rounded-2xl">
                            <div className="text-text-muted text-[11px] font-semibold">Rekordy</div>
                            <span className="text-[22px] text-carbs font-extrabold">{prCount} 🏆</span>

                        </div>
                    </div>
                    <div className="px-5 pt-5">
                        <div className="text-text-muted text-[13px] font-semibold uppercase">
                            CVIKY · { workoutDetail.sessionExercises.length }
                        </div>

                        { workoutDetail.sessionExercises.map((exercise)=> (
                                    <WorkoutSummaryCard key={exercise.id} {...exercise}/>
                        ))}
                    </div>

                    <div className={"px-5 pt-5"}>
                        <span className={"text-text-muted text-[13px] font-semibold uppercase"}>Poznámka k tréningu</span>
                        <textarea className={`w-full bg-btn border border-white/[0.07] mt-1 px-3 py-2 rounded-lg placeholder:text-text-faint ${!workoutDetail.note ? 'italic' : '' } px-1 text-[12.5px] resize-none outline-none text-text-primary`}
                                  readOnly
                                  placeholder={"+ Pridať poznámku"}
                                  value={workoutDetail.note}
                        />
                    </div>
                </>
            )}

            <BottomNav/>
        </div>
    )
}

export default WorkoutDetailPage;