import DayColumn from './DayColumn';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0=Sunday, 1=Monday...
    // Calculate Monday's date
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);

    return DAYS.map((day, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return {
            name: day,
            date: date,
            isToday: date.toDateString() === today.toDateString()
        };
    });
};

export default function WeekView({ meals, onUpdateMeal }) {
    const weekDates = getWeekDates();

    return (
        <div className="flex flex-col gap-6 pb-8">
            {weekDates.map(({ name, date, isToday }) => (
                <DayColumn
                    key={name}
                    day={name}
                    date={date}
                    isToday={isToday}
                    meals={meals.filter(m => m.day === name)}
                    onUpdateMeal={onUpdateMeal}
                />
            ))}
        </div>
    );
}
