export function getNowEastern(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

export function getDayOptions(): { offset: number; label: string }[] {
    return Array.from({ length: 4 }, (_, i) => {
        const d = getNowEastern();
        d.setDate(d.getDate() + i);
        const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        return { offset: i, label };
    });
}

export function getPickupTimeSlots(dayOffset: number): { value: string; label: string }[] {
    const slots = [];
    const currTime = getNowEastern();
    let startTime: Date;

    if (dayOffset === 0) {
        const orderCutoff = new Date(currTime);
        orderCutoff.setHours(17, 0, 0, 0);
        if (currTime >= orderCutoff) return [];

        startTime = new Date(currTime.getTime() + 20 * 60 * 1000);
        startTime.setSeconds(0, 0);
        const rem = startTime.getMinutes() % 15;
        if (rem !== 0) startTime.setMinutes(startTime.getMinutes() + (15 - rem));
        const noon = new Date(currTime);
        noon.setHours(12, 0, 0, 0);
        if (startTime < noon) startTime = noon;
    } else {
        startTime = new Date(currTime);
        startTime.setDate(startTime.getDate() + dayOffset);
        startTime.setHours(12, 0, 0, 0);
    }

    const cutoff = new Date(startTime);
    cutoff.setHours(17, 30, 0, 0);

    for (let i = 0; ; i++) {
        const d = new Date(startTime.getTime() + i * 15 * 60 * 1000);
        if (d > cutoff) break;
        const h = d.getHours();
        const m = d.getMinutes();
        const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const label = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        slots.push({ value, label });
    }
    return slots;
}