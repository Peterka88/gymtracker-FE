import BarbellIcon from "../../components/icons/BarbellIcon.tsx";
import {Line, LineChart} from "recharts";
import {type Equipment, type MuscleGroup, muscleGroupLabel} from "../../types/Exercises.ts";
import { formatLastPerformedExerciseDate } from "../../utils/formatDateTime.ts";
import DumbbellIcon from "../../components/icons/DumbbellIcon.tsx";
import MachineIcon from "../../components/icons/MachineIcon.tsx";
import BodyweightIcon from "../../components/icons/BodyweightIcon.tsx";
import CableIcon from "../../components/icons/CableIcon.tsx";
import * as React from "react";

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

function ExerciseRow({name, muscleGroup, equipment, lastDate, lastWeight}: {
    name: string
    muscleGroup: MuscleGroup
    equipment: Equipment
    lastDate: string | null
    lastWeight: number | null
}) {

    const equipmentIcons: Record<Equipment, React.JSX.Element> = {
        BARBELL: <BarbellIcon size={22} />,
        DUMBBELL: <DumbbellIcon size={24} />,
        MACHINE: <MachineIcon size={24} />,
        BODYWEIGHT: <BodyweightIcon size={24} />,
        CABLE: <CableIcon size={24} />
    }

    return (
        <div className="flex items-center gap-[13px] py-[13px] border-b border-white/5 last:border-b-0 cursor-pointer">
            <div className="w-[46px] h-[46px] rounded-2xl bg-btn border border-white/8 flex items-center justify-center shrink-0 text-text-secondary">
                {equipmentIcons[equipment]}
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