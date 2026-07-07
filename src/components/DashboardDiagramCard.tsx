import {PolarAngleAxis, RadialBar, RadialBarChart} from "recharts";


interface DiagramProps {
    kcalGoal: number;
    kcalRemaining: number;
    macros: { label: string; current: number; goal: number; color: string }[];
}

function DashboardDiagramCard({ kcalGoal, kcalRemaining, macros }: DiagramProps) {

    const percent = (1 - kcalRemaining / kcalGoal) * 100

    return(
        <div className="mx-5 mt-2 p-5 bg-card border border-white/[0.09] rounded-3xl">
            <div className="flex items-center justify-between mb-1">
                <span className="text-text-muted text-[13px] ml-10">Zostáva dnes</span>
                <span className="text-text-faint text-xs mr-10">Cieľ {kcalGoal} kcal</span>
            </div>
            <div className="flex gap-[18px] items-center mt-2">
                <div className="relative w-40 h-40 shrink-0">
                    <RadialBarChart
                        width={160}
                        height={160}
                        cx={80}
                        cy={80}
                        data={[{ value: percent }]}
                        innerRadius={50}
                        outerRadius={70}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar dataKey="value" background={{ fill: 'var(--color-track)' }}
                                   fill="var(--color-accent)" cornerRadius={999}
                        />
                    </RadialBarChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-[32px] font-extrabold leading-none">{kcalRemaining}</div>
                        <div className="text-text-muted text-[12px] mt-1">kcal zostáva</div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-[11px]">
                    {macros.map((macro) => (
                        <div key={macro.label}>
                            <div className="flex justify-between text-[12.5px] mb-1">
                                <span className="text-text-secondary">{macro.label}</span>
                                <span className="font-bold">
                                        {macro.current}
                                    <span className="text-text-faint font-medium"> / {macro.goal} g</span>
                                    </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-track overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${macro.color}`}
                                    style={{ width: `${Math.min(100, (macro.current / macro.goal) * 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardDiagramCard