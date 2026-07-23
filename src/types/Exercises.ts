
export type MuscleGroup =
    | "CHEST"
    | "BACK"
    | "SHOULDERS"
    | "BICEPS"
    | "TRICEPS"
    | "FOREARMS"
    | "CORE"
    | "QUADRICEPS"
    | "HAMSTRINGS"
    | "GLUTES"
    | "CALVES"
    | "FULL_BODY";


export type Equipment =
    "BARBELL" | "DUMBBELL" | "MACHINE" | "BODYWEIGHT" | "CABLE"

export interface Exercise {
    id: number
    name: string
    muscleGroup: MuscleGroup
    equipment: Equipment
    lastDate: string | null
    lastWeight: number | null
}

export const MuscleGroupCategory = {
    Hrudnik: 'Hrudník',
    Chrbat: 'Chrbát',
    Ramena: 'Ramená',
    Ruky: 'Ruky',
    Brucho: 'Brucho',
    Nohy: 'Nohy',
    CeleTelo: 'Celé telo',
} as const;

export type MuscleGroupCategory = (typeof MuscleGroupCategory)[keyof typeof MuscleGroupCategory];

export const muscleGroupLabel: Record<MuscleGroup, string> = {
    CHEST: 'Hrudník',
    BACK: 'Chrbát',
    SHOULDERS: 'Ramená',
    BICEPS: 'Biceps',
    TRICEPS: 'Triceps',
    FOREARMS: 'Predlaktia',
    CORE: 'Brucho',
    QUADRICEPS: 'Kvadricepsy',
    HAMSTRINGS: 'Zadné stehná',
    GLUTES: 'Sedacie svaly',
    CALVES: 'Lýtka',
    FULL_BODY: 'Celé telo',
};

export const equipmentLabel: Record<Equipment, string> = {
    BARBELL: "Činka",
    DUMBBELL: "Jednoručky",
    MACHINE: "Stroj",
    BODYWEIGHT: "Vlastná váha",
    CABLE: "Kladka"
}

export const muscleGroupCategory: Record<MuscleGroup, MuscleGroupCategory> = {
    CHEST: MuscleGroupCategory.Hrudnik,
    BACK: MuscleGroupCategory.Chrbat,
    SHOULDERS: MuscleGroupCategory.Ramena,
    BICEPS: MuscleGroupCategory.Ruky,
    TRICEPS: MuscleGroupCategory.Ruky,
    FOREARMS: MuscleGroupCategory.Ruky,
    CORE: MuscleGroupCategory.Brucho,
    QUADRICEPS: MuscleGroupCategory.Nohy,
    HAMSTRINGS: MuscleGroupCategory.Nohy,
    GLUTES: MuscleGroupCategory.Nohy,
    CALVES: MuscleGroupCategory.Nohy,
    FULL_BODY: MuscleGroupCategory.CeleTelo,
};

export function muscleGroupsInCategory(category: MuscleGroupCategory): MuscleGroup[] {
    return (Object.keys(muscleGroupCategory) as MuscleGroup[]).filter(
        (group) => muscleGroupCategory[group] === category
    );
}
