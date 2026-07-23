import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BarbellIcon from "../../components/icons/BarbellIcon.tsx";
import DumbbellIcon from "../../components/icons/DumbbellIcon.tsx";
import MachineIcon from "../../components/icons/MachineIcon.tsx";
import BodyweightIcon from "../../components/icons/BodyweightIcon.tsx";
import CableIcon from "../../components/icons/CableIcon.tsx";
import {type Equipment, equipmentLabel, type MuscleGroup, muscleGroupLabel} from "../../types/Exercises.ts";
import {exerciseApi} from "../../api/exercisesApi.ts";
import {useToast} from "../../context/ToastContext.tsx";

const equipmentIcons: Record<Equipment, () => ReactNode> = {
    BARBELL: () => <BarbellIcon size={30} />,
    DUMBBELL: () => <DumbbellIcon size={32} />,
    MACHINE: () => <MachineIcon />,
    BODYWEIGHT: () => <BodyweightIcon />,
    CABLE: () => <CableIcon />,
}

// function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
//     return (
//         <button
//             type="button"
//             onClick={onChange}
//             className={`w-[38px] h-[22px] rounded-full relative shrink-0 transition-colors duration-150 cursor-pointer ${checked ? 'bg-accent' : 'bg-track'}`}
//         >
//             <span
//                 className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150 ${checked ? 'right-0.5' : 'left-0.5'}`}
//             />
//         </button>
//     )
// }

const muscleGroups = Object.keys(muscleGroupLabel) as MuscleGroup[]
const equipmentOptions = Object.keys(equipmentLabel) as Equipment[]

function AddExercisePage() {

    const navigate = useNavigate();
    const [exerciseName, setExerciseName] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup>('CHEST');
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment>('BARBELL');
    // const [trackWeight, setTrackWeight] = useState(true);
    // const [trackReps, setTrackReps] = useState(true);
    // const [trackPr, setTrackPr] = useState(true);

    const { showSuccess, showError } = useToast()

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
                            {muscleGroupLabel[group]}
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
                            {equipmentLabel[equipment]}
                        </button>
                    ))}
                </div>
            </div>

            {/*<div className="mt-6 px-5">*/}
            {/*    <div className="text-text-muted text-[11px] font-bold tracking-[0.08em] uppercase mb-2">Sledovať</div>*/}
            {/*    <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">*/}
            {/*        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">*/}
            {/*            <span className="text-[14px] font-semibold">Váha</span>*/}
            {/*            <Toggle checked={trackWeight} onChange={() => setTrackWeight((v) => !v)} />*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">*/}
            {/*            <span className="text-[14px] font-semibold">Opakovania</span>*/}
            {/*            <Toggle checked={trackReps} onChange={() => setTrackReps((v) => !v)} />*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center justify-between px-4 py-3.5">*/}
            {/*            <span className="text-[14px] font-semibold">Sledovať osobný rekord (PR)</span>*/}
            {/*            <Toggle checked={trackPr} onChange={() => setTrackPr((v) => !v)} />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="px-5 mt-8">
                <button
                    onClick={() => {
                        exerciseApi.createExercise(exerciseName, selectedMuscleGroup, selectedEquipment)
                            .then(()=> {
                                showSuccess("Cvik uložený")
                                navigate('/exercises')
                            })
                            .catch((err) => {
                                if (axios.isAxiosError(err) && err.response?.status === 400) {
                                    showError("Cvik s týmto názvom už existuje")
                                }
                            })
                    }}
                    className="w-full bg-accent text-on-accent rounded-2xl py-4 text-[15px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer">
                    Vytvoriť cvik
                </button>
            </div>
        </div>
    )
}

export default AddExercisePage
