
export interface WorkoutSessionDetail {
    id: number
    name: string
    startedAt: string
    duration: number
    note: string
    pr: boolean
    location: Location | null
    sessionExercises: SessionExercise[]
}

export interface SessionExercise {
    id: number
    exerciseId: number
    exerciseName: string
    orderIndex: number
    note: string
    lastWeight: number
    lastReps: number
    workoutSets: WorkoutSet[]
}

export interface WorkoutSet {
    id: number
    weight: number
    reps: number
    pr:boolean
}

export interface Location {
    locationName: string | null
    address: string | null
    latitude?: number | null
    longitude?: number | null
}