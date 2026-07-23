const DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota']
const MONTHS = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december']
const MONTHS_GENITIVE = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra']

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

export function formatLastPerformedExerciseDate(date: string | null): string {
    if (!date) return 'zatiaľ nezaznamenané'

    const separatedDate = date.split('-')
    const day = Number(separatedDate[2])
    const month = MONTHS[Number(separatedDate[1]) - 1]

    return `${day}. ${month}`
}

export function formatTodayDate(): string {
    const today = new Date()
    return `${DAYS[today.getDay()]}, ${today.getDate()}. ${MONTHS_GENITIVE[today.getMonth()]}`
}

export function formatDayTime(): string {
    const hour = new Date().getHours()

    if (hour < 5) return 'Dobrú noc'
    if (hour < 12) return 'Dobré ráno'
    if (hour < 18) return 'Dobrý deň'
    if (hour < 23) return 'Dobrý večer'
    return 'Dobrú noc'
}
