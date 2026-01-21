export function buildDate({ year, month, day, hour, minute }) {
    return new Date(year, month - 1, day, hour, minute);
}

export function formatDate(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
}

export const currentDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes()
}