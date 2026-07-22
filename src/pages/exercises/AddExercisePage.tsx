import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import BarbellIcon from "../../components/icons/BarbellIcon.tsx";
import DumbbellIcon from "../../components/icons/DumbbellIcon.tsx";

function MachineIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="3.3" r="1.6" />
            <path d="M12 5v3" />
            <rect x="7" y="8" width="10" height="12.5" rx="1.8" />
            <line x1="7" y1="12.5" x2="17" y2="12.5" />
            <line x1="7" y1="16.7" x2="17" y2="16.7" />
        </svg>
    )
}

function BodyweightIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6v7" />
            <path d="M12 8.5l-5.5 -3" />
            <path d="M12 8.5l5.5 -3" />
            <path d="M12 13l-4.5 7" />
            <path d="M12 13l4.5 7" />
        </svg>
    )
}

function CableIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4.5" r="2.5" />
            <path d="M12 7v9" strokeDasharray="1.5 2.2" />
            <path d="M8.5 20a3.5 3.5 0 0 0 7 0" />
        </svg>
    )
}

const equipmentIcons: Record<string, () => ReactNode> = {
    'Činka': () => <BarbellIcon size={30} />,
    'Jednoručky': () => <DumbbellIcon size={32} />,
    'Stroj': MachineIcon,
    'Vlastná váha': BodyweightIcon,
    'Kladka': CableIcon,
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`w-[38px] h-[22px] rounded-full relative shrink-0 transition-colors duration-150 cursor-pointer ${checked ? 'bg-accent' : 'bg-track'}`}
        >
            <span
                className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${checked ? 'right-0.5' : 'left-0.5'}`}
            />
        </button>
    )
}

const muscleGroups = ['Hrudník', 'Chrbát', 'Nohy', 'Ramená', 'Ruky', 'Brucho']
const equipmentOptions = ['Činka', 'Jednoručky', 'Stroj', 'Vlastná váha', 'Kladka']

function AddExercisePage() {

    const navigate = useNavigate();
    const [exerciseName, setExerciseName] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Hrudník');
    const [selectedEquipment, setSelectedEquipment] = useState('Činka');
    const [trackWeight, setTrackWeight] = useState(true);
    const [trackReps, setTrackReps] = useState(true);
    const [trackPr, setTrackPr] = useState(true);

    return (
        <div className="flex flex-col min-h-screen pb-8">
            <div className="flex items-center justify-between mt-5 mx-2">
                <button onClick={() => navigate('/exercises')} className="w-[38px] h-[38px] rounded-full bg-btn border border-white/[0.08] flex items-center justify-center text-text-primary text-xl cursor-pointer">‹</button>
                <div className="text-[24px] font-extrabold">Nový cvik</div>
                <button onClick={() => navigate('/exercises')} className="w-[38px] h-[38px] rounded-full bg-btn border border-white/[0.08] flex items-center justify-center text-text-muted text-xl cursor-pointer">⨯</button>
            </div>

            <div className="flex flex-col items-center mt-8">
                <div className="w-20 h-20 rounded-3xl bg-card border border-white/[0.07] flex items-center justify-center text-accent">
                    {equipmentIcons[selectedEquipment]()}
                </div>
            </div>

            <div className="mt-7 px-5">
                <div className="text-text-muted text-[11px] font-bold tracking-[0.08em] uppercase mb-2">Názov cviku</div>
                <input
                    value={exerciseName}
                    onChange={(event) => setExerciseName(event.target.value)}
                    placeholder="napr. Tlaky na šikmej lavici"
                    className="w-full bg-chip border border-white/[0.08] rounded-2xl px-4 py-3.5 text-[14.5px] text-text-primary placeholder:text-text-faint outline-none"
                />
            </div>

            <div className="mt-6 px-5">
                <div className="text-text-muted text-[11px] font-bold tracking-[0.08em] uppercase mb-2">Svalová partia</div>
                <div className="flex flex-wrap gap-2">
                    {muscleGroups.map((group) => (
                        <button
                            key={group}
                            type="button"
                            onClick={() => setSelectedMuscleGroup(group)}
                            className={`px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                                selectedMuscleGroup === group
                                    ? 'bg-chip border-2 border-accent text-accent'
                                    : 'bg-chip border border-white/10 text-text-secondary'
                            }`}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 px-5">
                <div className="text-text-muted text-[11px] font-bold tracking-[0.08em] uppercase mb-2">Vybavenie</div>
                <div className="flex flex-wrap gap-2">
                    {equipmentOptions.map((equipment) => (
                        <button
                            key={equipment}
                            type="button"
                            onClick={() => setSelectedEquipment(equipment)}
                            className={`px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                                selectedEquipment === equipment
                                    ? 'bg-chip border-2 border-accent text-accent'
                                    : 'bg-chip border border-white/10 text-text-secondary'
                            }`}
                        >
                            {equipment}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 px-5">
                <div className="text-text-muted text-[11px] font-bold tracking-[0.08em] uppercase mb-2">Sledovať</div>
                <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
                        <span className="text-[14px] font-semibold">Váha</span>
                        <Toggle checked={trackWeight} onChange={() => setTrackWeight((v) => !v)} />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
                        <span className="text-[14px] font-semibold">Opakovania</span>
                        <Toggle checked={trackReps} onChange={() => setTrackReps((v) => !v)} />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3.5">
                        <span className="text-[14px] font-semibold">Sledovať osobný rekord (PR)</span>
                        <Toggle checked={trackPr} onChange={() => setTrackPr((v) => !v)} />
                    </div>
                </div>
            </div>

            <div className="px-5 mt-8">
                <button className="w-full bg-accent text-on-accent rounded-2xl py-4 text-[15px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer">
                    Vytvoriť cvik
                </button>
            </div>
        </div>
    )
}

export default AddExercisePage
