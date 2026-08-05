import {client} from "./client.ts";
import type {AxiosRequestConfig} from "axios";
import type {WorkoutSessionDetail, WorkoutSet} from "../types/workout.ts";
import type {WorkoutSummary} from "../types/WorkoutSummary.ts";
import {formatRelativeDay, formatRowDate} from "../utils/formatDateTime.ts";

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

function toWorkoutRowProps(workout: WorkoutApiResponse): WorkoutSummary {
    const {day, month} = formatRowDate(workout.date)
    return {
        id: workout.id,
        name: workout.name,
        date: day,
        month,
        pr: workout.pr,
        meta: `${formatRelativeDay(workout.date)} · ${workout.exercises} cvičení`
    }
}
