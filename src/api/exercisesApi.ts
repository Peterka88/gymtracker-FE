import {client} from "./client.ts";
import type {Exercise} from "../types/Exercises.ts";
import type {PageResponse} from "../types/PageResponse.ts";


export const exerciseApi = {
    getExercises: (page:number, size:number) => {
      return client.get<PageResponse<Exercise>>('/exercises', {params: {page,size}})
          .then((res) => res.data)
    },
    addToWorkout: (page = 0, size = 10) => {
        return client.get<PageResponse<Exercise>>('/exercises/workout', {params: {page, size}})
            .then((res) => res.data)
    }
}
