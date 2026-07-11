import type {WorkoutSessionDetail} from "../types/WorkoutSessionDetail.ts";
import {client} from "./client.ts";


export const fetchWorkoutSessionDetail = (userId: number = 1, id: number) => {
    return client.get<WorkoutSessionDetail>(`/workouts/${id}`, {params: {userId}})
        .then((res) => res.data)
}