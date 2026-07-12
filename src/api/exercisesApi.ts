import {client} from "./client.ts";
import type {Exercise} from "../types/Exercises.ts";
import type {PageResponse} from "../types/PageResponse.ts";


export const fetchExercises = (page: number = 0, size: number = 10) => {
    return client.get<PageResponse<Exercise>>('/exercises', {params: {page, size}})
        .then((res) => res.data)
}