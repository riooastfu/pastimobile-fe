export function getWorkingDays(startDate: Date, endDate: Date, holidays: string[]): number {
    // Constants
    const MS_PER_DAY = 1000 * 3600 * 24;
    const WORKING_DAYS_PER_WEEK = 5; // Assuming 5 working days per week (Monday to Friday)

    // Parse start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Convert holiday strings to Date objects
    const holidayDates = holidays.map(holiday => new Date(holiday));

    // Calculate total days between start and end dates, inclusive
    const totalDays = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;

    // Initialize working days counter
    let workingDays = 0;

    // Loop through each day in the date range
    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(start.getTime() + i * MS_PER_DAY);
        const dayOfWeek = currentDate.getDay();

        // Check if it's a weekday (Monday to Friday) and not a holiday
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday(currentDate, holidayDates)) {
            workingDays++;
        }
    }

    return workingDays;
}

// Function to check if a given date is in the list of holidays
function isHoliday(date: Date, holidays: Date[]): boolean {
    return holidays.some(holiday => isSameDay(date, holiday));
}

// Function to check if two dates are the same day (ignoring time)
function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}
