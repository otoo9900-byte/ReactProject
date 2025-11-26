import DayColumn from './DayColumn';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeekView({ meals, onUpdateMeal }) {
    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
                {DAYS.map(day => (
                    <DayColumn
                        key={day}
                        day={day}
                        meals={meals.filter(m => m.day === day)}
                        onUpdateMeal={onUpdateMeal}
                    />
                ))}
            </div>
        </div>
    );
}
