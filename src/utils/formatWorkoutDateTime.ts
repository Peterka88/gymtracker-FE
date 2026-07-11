const DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota']
const MONTHS = ['jan', 'feb', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december']

function pad(value: number): string {
    return value.toString().padStart(2, '0')
}

function formatTime(date: Date): string {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatWorkoutDateTime(startedAt: string, durationMin: number): string {
    const start = new Date(startedAt)
    const end = new Date(start.getTime() + durationMin * 60000)

    const dayName = DAYS[start.getDay()]
    const day = start.getDate()
    const month = MONTHS[start.getMonth()]
    const year = start.getFullYear()

    return `${dayName} ${day}. ${month} ${year} · ${formatTime(start)} – ${formatTime(end)}`
}
