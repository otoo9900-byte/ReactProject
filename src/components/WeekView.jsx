import DayColumn from './DayColumn';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeekView({ meals, onUpdateMeal }) {
    return (
        <div className="flex flex-col gap-6 pb-8">
            {DAYS.map(day => (
                <DayColumn
                    key={day}
                    day={day}
                    meals={meals.filter(m => m.day === day)}
                    onUpdateMeal={onUpdateMeal}
                />
            ))}
        </div>
    );
}
