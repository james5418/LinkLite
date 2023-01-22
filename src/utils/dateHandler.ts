export const isExpired = (date: Date): boolean => {
    const now = new Date();
    return date <= now
}

export const newExpiredDate = (): Date => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d;
}