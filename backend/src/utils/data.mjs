export function buildDate({ year, month, day, hour, minute }) {
    return new Date(year, month - 1, day, hour, minute);
}

export function formatDate(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
}