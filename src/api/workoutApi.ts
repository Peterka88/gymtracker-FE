import {client} from "./client.ts";
import type {AxiosRequestConfig} from "axios";
import type {WorkoutSessionDetail, WorkoutSet} from "../types/workout.ts";

interface WorkoutApiResponse {
    id: number;
    name: string;
    date: string;
    exercises: number;
    pr: boolean;
}

interface WorkoutSessionNewResponse {
    id: number
    name: string,
    startedAt: string
}

export const workoutApi = {
    getRecent: (size = 3) => {
        return client.get<WorkoutApiResponse[]>('/workouts', {params: {size}})
            .then((res) => res.data.map(toWorkoutRowProps))
    },
    getAll: (page = 0, size = 10) => {
        return client.get<WorkoutApiResponse[]>('/workouts', {params: {page, size}})
            .then((res) => res.data.map(toWorkoutRowProps))
    },
    getById: (id: number, config?: AxiosRequestConfig) => {
        return client.get<WorkoutSessionDetail>(`/workouts/${id}`, config)
            .then((res) => res.data)
    },
    create: () => {
        return client.post<WorkoutSessionNewResponse>('/workouts', null)
            .then((res) => res.data)
    },
    addExercise: async (sessionId: number, exerciseIds: number[]) => {
        await client.post(`/workouts/${sessionId}/exercises`, {exerciseIds});
    },
    addSet: (weight: number, reps: number ,exerciseSessionId: number)=> {
         return client.post<WorkoutSet>(`/workouts/exercises/${exerciseSessionId}/sets`, {weight, reps})
            .then((res) => res.data)
    },
    editSet: (weight: number, reps: number, setId: number) => {
        return client.put<WorkoutSet>(`/workout-sets/${setId}`, {weight, reps})
            .then((res) => res.data)
    },
    finishWorkout: (id: number) => {
        client.post(`/workouts/${id}/finish`);
    },
    deleteWorkout: (id: number) => {
        return client.delete(`/workouts/${id}`)
    },
    deleteSet: (id: number) => {
        return client.delete(`/workout-sets/${id}`)
    },
    updateWorkoutNameOrNote: (workoutId: number, note: string | null, name: string | null) => {
        var body = {}
        if (note) body = {note}
        if (name) body = {name}
        return client.patch(`/workouts/${workoutId}`, body)
    },
    updateExerciseNote: (exerciseSessionId: number, note: string) => {
        return client.patch(`/session-exercises/${exerciseSessionId}`, {note})
    },
    deleteExercise: (exerciseSessionId: number) => {
        return client.delete(`/session-exercises/${exerciseSessionId}`)
    }
}

const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MÁJ', 'JÚN', 'JÚL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC']
const MONTHS_LOWER = ['jan', 'feb', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december']

function formatRelativeDay(target: Date): string {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const day = new Date(target)
    day.setHours(0, 0, 0, 0)

    const diffDays = Math.round((today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Dnes'
    if (diffDays === 1) return 'Včera'
    if (diffDays > 1 && diffDays < 7) return `Pred ${diffDays} dňami`
    return `${day.getDate()}. ${MONTHS_LOWER[day.getMonth()]}`
}

function toWorkoutRowProps(workout: WorkoutApiResponse) {
    const parsedDate = new Date(workout.date)
    const today = parsedDate.getDate().toString()
    return {
        id: workout.id,
        name: workout.name,
        date: today,
        month: MONTHS_SHORT[parsedDate.getMonth()],
        pr: workout.pr,
        meta: `${formatRelativeDay(parsedDate)} · ${workout.exercises} cvičení`
    }
}
