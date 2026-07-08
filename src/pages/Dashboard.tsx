import DashboardDiagram from "../components/DashboardDiagramCard";
import TodayMeals from "../components/TodayMeals";
import WorkoutRow from "../components/WorkoutRow.tsx";
import BottomNav from "../components/BottomNav";
import {useEffect, useState} from "react";
import type {WorkoutSummary} from "../types/WorkoutSummary.ts";
import {workoutApi} from "../api/workoutApi.ts";
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();


    const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSummary[]>([]);
    const [workoutsLoading, setWorkoutsLoading] = useState(true);

    const kcalRemaining = 1358
    const kcalGoal = 2000

    const macros = [
        { label: 'Bielkoviny', current: 52, goal: 130, color: 'bg-protein' },
        { label: 'Sacharidy', current: 68, goal: 220, color: 'bg-carbs' },
        { label: 'Tuky', current: 14, goal: 65, color: 'bg-fat' },
    ]

    const meals = [
        { name: 'Raňajky', detail: 'Ovsené vločky s ovocím · 2 položky', kcal: 280 },
        { name: 'Obed', detail: 'Kuracie prsia s ryžou · 4 položky', kcal: 642 },
    ]


    useEffect(() => {
        workoutApi.getRecent(1, 3).then((data) => {
            setRecentWorkouts(data);
            setWorkoutsLoading(false);
        });
    },[])

    return (
        <div className="flex flex-col min-h-screen pb-28">
            <div className="flex items-center justify-between px-[22px] pt-1.5 pb-2">
                <div>
                    <div className="text-text-muted text-[13px]">Nedeľa, 28. júna</div>
                    <div className="text-[23px] font-extrabold mt-0.5">Dobré ráno, Denis</div>
                </div>
                <div className="w-[42px] h-[42px] rounded-full bg-card border border-white/10" />
            </div>

            <DashboardDiagram kcalGoal={kcalGoal} kcalRemaining={kcalRemaining} macros={macros}/>

            <div className="flex gap-2 px-5 pt-4">
                <button className="flex-[1.4] flex items-center cursor-pointer justify-center gap-2 py-3.5 rounded-2xl bg-accent text-on-accent text-[13.5px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97]">
                    ＋ Pridať jedlo
                </button>
                <button className="flex-1 py-3.5 rounded-2xl border cursor-pointer border-white/10 bg-chip text-text-secondary text-[13.5px] font-bold transition-all duration-150 hover:bg-white/6 active:scale-[0.97]">
                    Tréning
                </button>
            </div>

            <TodayMeals meals={meals}/>

            <div className="flex items-center justify-between px-[22px] pt-[22px] pb-1.5">
                <span className="text-[15px] font-extrabold">Posledné tréningy</span>
                <button className="text-accent text-[12.5px] font-bold cursor-pointer" onClick={() => {navigate("/workouts")}}>
                    Všetky tréningy
                </button>
            </div>
            {workoutsLoading ? (
                <div className="mx-5 px-1 bg-card border border-white/[0.09] rounded-3xl">
                    <div className="flex items-center justify-center gap-1.5 py-6">
                        <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" />
                    </div>
                </div>
            ) : (
                <div className="mx-5 px-1 bg-card border border-white/[0.09] rounded-3xl">
                    {recentWorkouts.map((workout, i) => (
                        <WorkoutRow id={workout.id} name={workout.name} date={workout.date} month={workout.month} pr={workout.pr} meta={workout.meta} index={i} />
                    ))}
                </div>
            )}

            <BottomNav />
        </div>
    )
}

export default Dashboard;