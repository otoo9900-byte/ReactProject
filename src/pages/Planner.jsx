import { useMeals } from '../context/MealContext';
import WeekView from '../components/WeekView';

export default function Planner() {
    const { meals, updateMeal, language } = useMeals();

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800">
                📅 {language === 'ko' ? '주간 식단표' : 'Weekly Planner'}
            </h1>
            <WeekView meals={meals} onUpdateMeal={updateMeal} />
        </div>
    );
}
