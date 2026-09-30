

export interface CalendarView {
    month: number
    year: number
    days: CalendarDay[]
}

export interface CalendarDay {
    workoutSessionId: number
    dayOfMonth: number
    pr: boolean
}