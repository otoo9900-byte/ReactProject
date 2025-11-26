import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from './hooks/useLocalStorage';
import WeekView from './components/WeekView';
import IngredientList from './components/IngredientList';

function App() {
  const [meals, setMeals] = useLocalStorage('smart-meal-planner-meals', []);
  const [checkedIngredients, setCheckedIngredients] = useLocalStorage('smart-meal-planner-checked', {});

  const updateMeal = (day, type, menuName, ingredients) => {
    setMeals(prevMeals => {
      const existingMealIndex = prevMeals.findIndex(m => m.day === day && m.type === type);
      const newMeal = {
        id: existingMealIndex >= 0 ? prevMeals[existingMealIndex].id : uuidv4(),
        day,
        type,
        menuName,
        ingredients
      };

      if (existingMealIndex >= 0) {
        const newMeals = [...prevMeals];
        if (!menuName && ingredients.length === 0) {
          // Remove meal if empty
          newMeals.splice(existingMealIndex, 1);
        } else {
          newMeals[existingMealIndex] = newMeal;
        }
        return newMeals;
      } else {
        if (!menuName && ingredients.length === 0) return prevMeals;
        return [...prevMeals, newMeal];
      }
    });
  };

  const aggregatedIngredients = useMemo(() => {
    const map = new Map();

    meals.forEach(meal => {
      meal.ingredients.forEach(ing => {
        const name = ing.trim();
        if (!name) return;

        if (map.has(name)) {
          map.set(name, map.get(name) + 1);
        } else {
          map.set(name, 1);
        }
      });
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
      checked: !!checkedIngredients[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [meals, checkedIngredients]);

  const toggleIngredientCheck = (name) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2 py-8">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-sm tracking-tight">
            🥗 Smart Meal Planner
          </h1>
          <p className="text-white/90 text-lg font-medium">
            Plan your week, get your shopping list automatically.
          </p>
        </header>

        <main className="space-y-8">
          <section>
            <WeekView meals={meals} onUpdateMeal={updateMeal} />
          </section>

          <section>
            <IngredientList
              ingredients={aggregatedIngredients}
              onToggleCheck={toggleIngredientCheck}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
