import {useState} from "react";

function Stepper({label, value, onChange, color, allowDecimals = true}: {
    label: string
    value: number
    onChange: (value: number) => void
    color: string
    allowDecimals?: boolean
}) {
    const [text, setText] = useState(String(value));

    function commit(newValue: number) {
        const rounded = allowDecimals ? Math.round(newValue * 100) / 100 : Math.round(newValue);
        onChange(rounded);
        setText(String(rounded));
    }

    function handleTextChange(raw: string) {
        const normalized = raw.replace(',', '.');
        const pattern = allowDecimals ? /^\d*\.?\d{0,2}$/ : /^\d*$/;
        if (normalized === '' || pattern.test(normalized)) {
            setText(raw);
            const parsed = parseFloat(normalized);
            if (!isNaN(parsed)) {
                onChange(parsed);
            }
        }
    }

    return (
        <div className="flex-1 min-w-0">
            <div className={`text-[11px] font-bold text-center mb-2 ${color}`}>{label}</div>
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => commit(Math.max(0, value - 1))}
                    className="shrink-0 w-7 h-7 rounded-full bg-btn border border-white/10 flex items-center justify-center text-lg cursor-pointer"
                >
                    −
                </button>
                <input
                    type="text"
                    inputMode={allowDecimals ? 'decimal' : 'numeric'}
                    value={text}
                    onChange={(event) => handleTextChange(event.target.value)}
                    onBlur={() => setText(String(value))}
                    className="text-[20px] font-extrabold w-12 min-w-0 text-center bg-transparent outline-none"
                />
                <button
                    onClick={() => commit(value + 1)}
                    className="shrink-0 w-7 h-7 rounded-full bg-btn border border-white/10 flex items-center justify-center text-lg cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    )
}


export default Stepper;