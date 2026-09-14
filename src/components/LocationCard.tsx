import LocationIcon from "./icons/LocationIcon.tsx";
import type {Location} from "../types/workout.ts";

function LocationCard({ location, onClick }: { location: Location | null, onClick: () => void }) {
    if (location) {
        return (
            <button
                onClick={onClick}
                className="w-full flex items-center gap-3 p-3 bg-card border border-white/[0.07] rounded-2xl cursor-pointer"
            >
                <div className="w-9 h-9 shrink-0 rounded-xl bg-accent/[0.16] text-accent flex items-center justify-center">
                    <LocationIcon size={18} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <div className="text-[14px] font-extrabold truncate">{location.locationName}</div>
                    { location.address && (
                        <div className="text-accent text-[12px] font-semibold truncate">{location.address}</div>
                    )}
                </div>
                <span className="text-text-muted text-lg shrink-0">›</span>
            </button>
        )
    }

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 bg-card border border-dashed border-white/[0.15] rounded-2xl cursor-pointer"
        >
            <div className="w-9 h-9 shrink-0 rounded-xl bg-btn text-text-muted flex items-center justify-center">
                <LocationIcon size={18} />
            </div>
            <div className="flex-1 min-w-0 text-left text-[13.5px] font-bold text-text-secondary">
                Pridať lokáciu
            </div>
            <span className="text-text-muted text-lg shrink-0">›</span>
        </button>
    )
}

export default LocationCard;