
interface WorkoutRowProps {
    id: number
    name: string
    date: string
    month: string
    pr: boolean
    meta: string
    index: number
}

function WorkoutRow({id, name, date, month, pr, meta, index}:WorkoutRowProps) {

    return(
        <>
            <div key={id}
                 className={`flex items-center gap-[13px] px-[13px] py-[13px] cursor-pointer border-b border-white/5 last:border-b-0`}>
                <div className={`w-[46px] h-[46px] rounded-2xl flex flex-col items-center justify-center shrink-0
            ${index === 0 ? 'bg-accent/[0.13]' : 'bg-btn border border-white/[0.07]'}`}>
                    <span
                        className={`text-16px font-extrabold leading-none ${index === 0 ? 'text-accent' : ''}`}>{date}</span>
                    <span
                        className={`text-[9px] font-bold mt-0.5 ${index === 0 ? 'text-accent' : 'text-text-muted'}`}>{month}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-[14px] font-bold">
                        {name}
                        {pr && (
                            <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-carbs/[0.16] text-carbs text-[9px] font-extrabold">
                                🏆 PR
                            </span>
                        )}
                    </div>
                    <div className="text-text-muted text-xs mt-0.5 align-bottom">{meta}</div>
                </div>
                <span className="text-text-muted text-xs mt-0.5">›</span>
            </div>
        </>
    )}

export default WorkoutRow;