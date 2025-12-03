import { createContext, useContext, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';

const MealContext = createContext();

export function MealProvider({ children }) {
    const [meals, setMeals] = useLocalStorage('smart-meal-planner-meals', []);
    const [checkedIngredients, setCheckedIngredients] = useLocalStorage('smart-meal-planner-checked', {});
    const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage('smart-meal-planner-recipes', []);

    const updateMeal = (day, type, menuName, ingredients, recipe = '') => {
        setMeals(prevMeals => {
            const existingMealIndex = prevMeals.findIndex(m => m.day === day && m.type === type);
            const newMeal = {
                id: existingMealIndex >= 0 ? prevMeals[existingMealIndex].id : uuidv4(),
                day,
                type,
                menuName,
                ingredients,
                recipe
            };

            if (existingMealIndex >= 0) {
                const newMeals = [...prevMeals];
                if (!menuName && ingredients.length === 0) {
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

    const toggleIngredientCheck = (name) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const addRecipe = (name, ingredients, instructions = '') => {
        setFavoriteRecipes(prev => [...prev, { id: uuidv4(), name, ingredients, instructions }]);
    };

    const removeRecipe = (id) => {
        setFavoriteRecipes(prev => prev.filter(r => r.id !== id));
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

    const [language, setLanguage] = useLocalStorage('smart-meal-planner-language', 'ko');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
    };

    const value = {
        meals,
        updateMeal,
        aggregatedIngredients,
        toggleIngredientCheck,
        favoriteRecipes,
        addRecipe,
        removeRecipe,
        language,
        toggleLanguage
    };

    return (
        <MealContext.Provider value={value}>
            {children}
        </MealContext.Provider>
    );
}

export function useMeals() {
    return useContext(MealContext);
}
