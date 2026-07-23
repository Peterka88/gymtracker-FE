import BarbellIcon from "../../components/icons/BarbellIcon.tsx";
import {Line, LineChart} from "recharts";
import { type MuscleGroup, muscleGroupLabel } from "../../types/Exercises.ts";
import { formatLastPerformedExerciseDate } from "../../utils/formatDateTime.ts";

function Sparkline({ data }:{ data:number[] }) {
    const points = data.map((value, index) => ({ index, value }))
    return (
        <LineChart width={64} height={28} data={points}>
            <Line
                type="monotone"
                dataKey="value"
                stroke='var(--color-accent)'
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
            />
        </LineChart>
    )
}

function ExerciseRow({name, muscleGroup, lastDate, lastWeight}: {
    name: string
    muscleGroup: MuscleGroup
    lastDate: string | null
    lastWeight: number | null
}) {

    return (
        <div className="flex items-center gap-[13px] py-[13px] border-b border-white/5 last:border-b-0 cursor-pointer">
            <div className="w-[46px] h-[46px] rounded-2xl bg-btn border border-white/8 flex items-center justify-center shrink-0 text-text-secondary">
                <BarbellIcon />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center text-[14.5px] font-bold">
                    {name}
                </div>
                <div className="text-text-muted text-xs mt-0.5">
                    {muscleGroupLabel[muscleGroup]} · {formatLastPerformedExerciseDate(lastDate)}
                    {lastWeight !== null && ` · ${lastWeight} kg`}
                </div>
            </div>
            <Sparkline data={[10, 50, 80, 100, 120, 150]} />
            <span className="text-text-faint text-lg">›</span>
        </div>
    )
}

export default ExerciseRow;