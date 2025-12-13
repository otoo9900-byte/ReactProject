import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';

import WeekView from '../components/WeekView';
import { useMeals } from '../context/MealContext';
import MealSlot from '../components/MealSlot';
import { useState } from 'react';
import AISuggestion from '../components/AISuggestion';

export default function Planner() {
    const { meals, moveMeal, t, language } = useMeals();
    const [activeId, setActiveId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        setDragOffset({ x: 0, y: 0 });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // over.id format: "Day-Type" (e.g., "Monday-Lunch")
            // But wait, our droppables are slots, so their IDs are "Monday-Lunch"
            // Active item ID is the meal UUID.

            const [targetDay, targetType] = over.id.split('-');

            // Check if valid drop target (simple validation)
            if (targetDay && targetType) {
                moveMeal(active.id, targetDay, targetType);
            }
        }

        setActiveId(null);
    };

    // Find active meal implementation (same as before)
    const activeMeal = meals.find(m => m.id === activeId);


    return (
        <div className="max-w-7xl mx-auto pb-20">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 mb-2">
                    {language === 'ko' ? '주간 식단표' : 'Weekly Planner'}
                </h1>
                <p className="text-theme-secondary">
                    {language === 'ko' ? '드래그해서 식단을 자유롭게 이동해보세요.' : 'Drag and drop to rearrange your meals.'}
                </p>
            </header>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <WeekView meals={meals} onUpdateMeal={useMeals().updateMeal} />

                <DragOverlay dropAnimation={{
                    duration: 250,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}>
                    {activeId && activeMeal ? (
                        <div className="w-[300px] opacity-90 rotate-3 scale-105 cursor-grabbing">
                            <MealSlot
                                day={activeMeal.day}
                                type={activeMeal.type}
                                meal={activeMeal}
                                onUpdate={() => { }} // Dummy 
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <AISuggestion />
        </div>
    );
}
