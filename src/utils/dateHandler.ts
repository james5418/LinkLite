import dayjs from "dayjs";

export const isExpired = (date: Date): boolean => {
    const now = new Date();
    return date <= now
}

export const newExpiredDate = (): Date => {
    const now = dayjs();
    const newDate = now.add(180, 'day');
    return newDate.toDate();
}