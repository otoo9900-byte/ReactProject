import MealSlot from './MealSlot';

export default function DayColumn({ day, meals, onUpdateMeal }) {
    const getMeal = (type) => meals.find(m => m.type === type);

    return (
        <div className="flex flex-col gap-3 min-w-[180px]">
            <h3 className="font-bold text-center py-3 rounded-xl glass-panel text-white tracking-wide shadow-sm">
                {day}
            </h3>
            <div className="flex flex-col gap-3">
                <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-1">Breakfast</div>
                <MealSlot
                    day={day}
                    type="Breakfast"
                    meal={getMeal('Breakfast')}
                    onUpdate={onUpdateMeal}
                />

                <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-1">Lunch</div>
                <MealSlot
                    day={day}
                    type="Lunch"
                    meal={getMeal('Lunch')}
                    onUpdate={onUpdateMeal}
                />

                <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-1">Dinner</div>
                <MealSlot
                    day={day}
                    type="Dinner"
                    meal={getMeal('Dinner')}
                    onUpdate={onUpdateMeal}
                />
            </div>
        </div>
    );
}
