

interface TodayMealsProps {
    meals: { name: string; detail: string; kcal: number }[];
}

function TodayMeals({ meals }: TodayMealsProps) {

    return (
        <div>
            <div className="flex items-center justify-between px-[22px] pt-[22px] pb-1.5">
                <span className="text-[15px] font-extrabold">Dnešné jedlá</span>
                <span className="text-accent text-[12.5px] font-bold cursor-pointer">Celý denník</span>
            </div>
            <div className="mx-5 bg-card border border-white/5 rounded-3xl px-5">
                {meals.map(meal => (
                        <div key={meal.name} className="flex items-center gap-[13px] py-[13px] border-b border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-card border border-white/[0.07] shrink-0"/>
                            <div className="flex-1">
                                <div className="text-[14px] font-bold">{meal.name}</div>
                                <div className="text-text-faint text-xs mt-0.5">{meal.detail}</div>
                            </div>
                            <span className="text-[13.5px] font-bold">
                                    {meal.kcal}
                                <span className="text-text-faint font-medium text-[11px]">kcal</span>
                                </span>
                        </div>
                    )
                )}
                <div className="flex items-center gap-[13px] py-[13px] cursor-pointer">
                    <div className="w-10 h-10 rounded-xl border border-dashed border-white/[0.18] flex items-center justify-center shrink-0">
                        +
                    </div>
                    <div className="flex-1">
                        <div className="text-[14px] text-text-secondary">Večera</div>
                        <div className="text-text-faint text-xs mt-0.5">Pridať jedlo</div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TodayMeals;