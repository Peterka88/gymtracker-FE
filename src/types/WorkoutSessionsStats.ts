import type {MuscleGroup} from "./Exercises.ts";

interface NeglectedMuscleGroup {
    muscleGroup: MuscleGroup;
    daysSinceLastTrained: number | null;
}

interface WorkoutSessionsStats {
    workoutsLast30Days: number;
    workoutsThisYear: number;
    prsLast30Days: number;
    neglectedMuscleGroup: NeglectedMuscleGroup | null;
    daysSinceLastWorkout: number | null;
}

export type { WorkoutSessionsStats, NeglectedMuscleGroup };