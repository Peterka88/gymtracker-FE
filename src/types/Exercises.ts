import type {WorkoutSummary} from "./WorkoutSummary.ts";

export type MuscleGroup =
    | "CHEST"
    | "BACK"
    | "SHOULDERS"
    | "TRAPS"
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

export interface ExerciseInfo {
    totalExercises: number;
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
    TRAPS: 'Trapézy',
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
    TRAPS: MuscleGroupCategory.Chrbat,
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

export interface ProgressData {
    date: string
    weight: number
    volume: number
    estimated1RM: number
}

export interface ExerciseStats {
    id: number
    name: string
    muscleGroup: MuscleGroup
    equipment: Equipment
    pr: number
    lastTraining: number
    totalWorkouts: number
    progressData: ProgressData[]
}

export interface ExerciseHistory {
    id: number
    name: string
    pr: boolean
    date: string
    bestWeight: number
    setCount: number
    totalReps: number
    volume: number
}

export interface ExerciseHistoryRow extends WorkoutSummary {
    weight: number
}
