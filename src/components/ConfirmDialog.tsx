function ConfirmDialog({title, description, onConfirm, onCancel, confirmLabel, cancelLabel, confirmColor}: {
    title: string
    description: string
    onConfirm: () => void
    onCancel: ()  => void
    confirmLabel: string
    cancelLabel: string
    confirmColor: 'red' | 'green' | 'blue'
}) {

    const confirmColorClasses: Record<'red' | 'green' | 'blue', string> = {
        red: 'bg-red-500 text-white',
        green: 'bg-accent',
        blue: 'bg-blue-600'
    }

    return (
        <div
            onClick={() => onCancel()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-sm bg-card border border-white/[0.07] rounded-2xl p-5"
            >
                <div className="text-[15px] font-extrabold">{title}</div>
                <div className="text-text-muted text-[13px] mt-1.5">
                    {description}
                </div>
                <div className="flex gap-2.5 mt-4">
                    <button
                        onClick={() => onCancel()}
                        className="flex-1 py-3 rounded-2xl bg-btn border border-white/[0.08] text-[13.5px] font-bold cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => onConfirm()}
                        className={`flex-1 py-3 rounded-2xl ${confirmColorClasses[confirmColor]} text-white text-[13.5px] font-bold cursor-pointer`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog