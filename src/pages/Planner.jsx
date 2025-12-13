import { useMeals } from '../context/MealContext';
import WeekView from '../components/WeekView';

import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export default function Planner() {
    const { meals, updateMeal, language, moveMeal } = useMeals();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement to start drag, prevents accidental drags on clicks
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const [day, type] = over.id.split('-');
            // Call moveMeal with mealId (active.id) and target location
            moveMeal(active.id, day, type);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-theme-primary">
                📅 {language === 'ko' ? '주간 식단표' : 'Weekly Planner'}
            </h1>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <WeekView meals={meals} onUpdateMeal={updateMeal} />
            </DndContext>
        </div>
    );
}
