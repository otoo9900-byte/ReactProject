import MealSlot from './MealSlot';
import { useMeals } from '../context/MealContext';

export default function DayColumn({ day, meals, onUpdateMeal }) {
    const { language } = useMeals();
    const getMeal = (type) => meals.find(m => m.type === type);

    const t = {
        breakfast: language === 'ko' ? '아침' : 'Breakfast',
        lunch: language === 'ko' ? '점심' : 'Lunch',
        dinner: language === 'ko' ? '저녁' : 'Dinner'
    };

    // Simple day translation map
    const dayMap = {
        'Monday': '월요일', 'Tuesday': '화요일', 'Wednesday': '수요일',
        'Thursday': '목요일', 'Friday': '금요일', 'Saturday': '토요일', 'Sunday': '일요일'
    };

    const displayDay = language === 'ko' ? dayMap[day] : day;

    return (
        <div className="glass-panel p-6 flex flex-col md:flex-row gap-6 items-start md:items-stretch">
            {/* Day Header */}
            <div className="w-full md:w-32 shrink-0 flex md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0 md:pr-6">
                <h3 className="text-xl font-bold text-gray-800 tracking-wide">
                    {displayDay}
                </h3>
                <span className="text-xs font-medium text-gray-500 bg-white/50 px-2 py-1 rounded-lg">
                    {meals.length} meals
                </span>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{t.breakfast}</div>
                    <MealSlot
                        day={day}
                        type="Breakfast"
                        meal={getMeal('Breakfast')}
                        onUpdate={onUpdateMeal}
                    />
                </div>

                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{t.lunch}</div>
                    <MealSlot
                        day={day}
                        type="Lunch"
                        meal={getMeal('Lunch')}
                        onUpdate={onUpdateMeal}
                    />
                </div>

                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{t.dinner}</div>
                    <MealSlot
                        day={day}
                        type="Dinner"
                        meal={getMeal('Dinner')}
                        onUpdate={onUpdateMeal}
                    />
                </div>
            </div>
        </div>
    );
}
