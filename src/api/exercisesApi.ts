import {client} from "./client.ts";
import type {Equipment, Exercise, ExerciseInfo, ExerciseStats, MuscleGroup} from "../types/Exercises.ts";
import type {PageResponse} from "../types/PageResponse.ts";


export const exerciseApi = {
    getExercises: (page: number, size: number, muscleGroups?: MuscleGroup[], search?: string) => {
      return client.get<PageResponse<Exercise>>('/exercises', {
          params: {
              search: search || undefined,
              muscleGroups: muscleGroups?.length ? muscleGroups.join(',') : undefined,
              page,
              size
          }
      }).then((res) => res.data)
    },
    addToWorkout: (page = 0, size = 10) => {
        return client.get<PageResponse<Exercise>>('/exercises/workout', {params: {page, size}})
            .then((res) => res.data)
    },
    createExercise: (name: string, muscleGroup: MuscleGroup, equipment: Equipment) => {
        return client.post('/exercises', {name, muscleGroup, equipment}, {skipErrorToastStatuses: [400]})
    },
    info: () => {
        return client.get<ExerciseInfo>('/exercises/info').then((res) => res.data);
    },
    exerciseStats: (id: number) => {
        return client.get<ExerciseStats>(`/exercises/${id}/stats`, {skipErrorToastStatuses: [404]})
            .then((res) => res.data);
    }
}
