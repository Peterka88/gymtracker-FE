import {client} from "./client.ts";

interface WorkoutApiResponse {
    id: number;
    name: string;
    date: string;
    exercises: number;
    pr: boolean;
}

export const workoutApi = {
    getRecent: (userId = 1,size = 3) => {
        return client.get<WorkoutApiResponse[]>('/workouts', {params: {userId, size}}).
        then((res) => res.data.map(toWorkoutRowProps))
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