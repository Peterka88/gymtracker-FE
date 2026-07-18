import {client} from "./client.ts";
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
    getRecent: (userId = 1, size = 3) => {
        return client.get<WorkoutApiResponse[]>('/workouts', {params: {userId, size}})
            .then((res) => res.data.map(toWorkoutRowProps))
    },
    getAll: (userId = 1, page = 0, size = 10) => {
        return client.get<WorkoutApiResponse[]>('/workouts', {params: {userId, page, size}})
            .then((res) => res.data.map(toWorkoutRowProps))
    },
    getById: (id: number, userId: number = 1) => {
        return client.get<WorkoutSessionDetail>(`/workouts/${id}`, {params: {userId}})
            .then((res) => res.data)
    },
    create: (userId: number = 1) => {
        return client.post<WorkoutSessionNewResponse>('/workouts', null, {params: {userId}})
            .then((res) => res.data)
    },
    addExercise: async (sessionId: number, exerciseIds: number[], userId: number) => {
        await client.post(`/workouts/${sessionId}/exercises`, {exerciseIds}, {params: {userId}});
    },
    addSet: (weight: number, reps: number ,exerciseSessionId: number, userId: number)=> {
         return client.post<WorkoutSet>(`/workouts/exercises/${exerciseSessionId}/sets`, {weight, reps} , {params: {userId}})
            .then((res) => res.data)
    },
    editSet: (weight: number, reps: number, setId: number, userId: number) => {
        return client.put<WorkoutSet>(`/workout-sets/${setId}`, {weight, reps} ,{params: {userId}})
            .then((res) => res.data)
    },
    finishWorkout: (id: number, userId: number) => {
        client.post(`/workouts/${id}/finish`, {params: {userId}});
    },
    deleteWorkout: (id: number) => {
        return client.delete(`/workouts/${id}`)
    },
    deleteSet: (id: number, userId: number) => {
        return client.delete(`/workout-sets/${id}`, {params: {userId}})
    },
    updateWorkoutNameOrNote: (workoutId: number, note: string | null, name: string | null, userId: number = 1) => {
        var body = {}
        if (note) body = {note}
        if (name) body = {name}
        return client.patch(`/workouts/${workoutId}`, body, {params: {userId}})
    },
    updateExerciseNote: (exerciseSessionId: number, note: string, userId: number = 1) => {
        return client.patch(`/session-exercises/${exerciseSessionId}`, {note}, {params: {userId}})
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
