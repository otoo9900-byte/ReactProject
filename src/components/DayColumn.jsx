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
        <div className="flex flex-col gap-3 min-w-[180px]">
            <h3 className="font-bold text-center py-3 rounded-xl glass-panel text-white tracking-wide shadow-sm">
                {displayDay}
            </h3>
            <div className="flex flex-col gap-3">
                <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-1">{t.breakfast}</div>
                <MealSlot
                    day={day}
                    type="Breakfast"
                    meal={getMeal('Breakfast')}
                    onUpdate={onUpdateMeal}
                />

                <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-1">{t.lunch}</div>
                <MealSlot
                    day={day}
                    type="Lunch"
                    meal={getMeal('Lunch')}
                    onUpdate={onUpdateMeal}
                />

                <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest px-1">{t.dinner}</div>
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
