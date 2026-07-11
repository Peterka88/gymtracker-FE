export function formatSeries(count:number): string {
    if (count === 1) {
        return `${count} séria`;
    } else if (count > 1 && count < 5) {
        return `${count} série`;
    } else {
        return `${count} sérií`;
    }
}