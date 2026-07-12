
export interface WorkoutSessionDetail {
    id: number
    name: string
    startedAt: string
    duration: number
    note: string
    pr: boolean
    sessionExercises: SessionExercise[]
}

export interface SessionExercise {
    id: number
    exerciseId: number
    exerciseName: string
    orderIndex: number
    note: string
    workoutSets: WorkoutSet[]
}

export interface WorkoutSet {
    id: number
    weight: number
    reps: number
    pr:boolean
}