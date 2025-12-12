import { createContext, useContext, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
import { normalizeIngredients } from '../utils/api';

const MealContext = createContext();

export function MealProvider({ children }) {
    const [meals, setMeals] = useLocalStorage('smart-meal-planner-meals', []);
    const [checkedIngredients, setCheckedIngredients] = useLocalStorage('smart-meal-planner-checked', {});
    const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage('smart-meal-planner-recipes', []);
    const [hiddenIngredients, setHiddenIngredients] = useLocalStorage('smart-meal-planner-hidden-ingredients', {});


    const updateMeal = (day, type, menuName, ingredients, recipe = '', imageKeywords = '') => {
        setMeals(prevMeals => {
            const existingMealIndex = prevMeals.findIndex(m => m.day === day && m.type === type);
            const newMeal = {
                id: existingMealIndex >= 0 ? prevMeals[existingMealIndex].id : uuidv4(),
                day,
                type,
                menuName,
                ingredients,
                recipe,
                imageKeywords
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
                let name = ing.trim();
                if (!name) return;

                // Automatic Cleaning Logic
                // 1. Remove text inside parentheses (e.g., "Milk (low fat)")
                name = name.replace(/\s*\([^)]*\)/g, '');

                // 2. Remove quantities at the end (e.g., "Soy Sauce 1 tbsp", "Onion 1", "Pork 300g")
                // Matches space followed by digit(s) and any following characters to the end
                name = name.replace(/\s+\d+.*$/, '');

                // 3. Remove quantities at the start (e.g., "1 Egg", "1/2 Onion")
                name = name.replace(/^\d+([./]\d+)?\s*/, '');

                // 4. Remove standalone Korean counts if attached tightly (e.g., "계란2개" => "계란")
                name = name.replace(/\d+[가-힣a-zA-Z]*$/, '');

                // 5. Remove vague quantifiers (Korean)
                // e.g., "후추 약간", "소금 조금", "깨 적당량"
                name = name.replace(/\s+(약간|조금|적당량|한줌|한꼬집|취향껏|상당량|소량|다수).*$/, '');

                // 6. Synonym Normalization
                const synonyms = {
                    '달걀': '계란',
                    'egg': '계란',
                    'eggs': '계란',
                    '파': '대파' // Optional: often people mean green onion when they say pa
                };
                if (synonyms[name]) {
                    name = synonyms[name];
                }

                name = name.trim();
                if (!name) return;

                // Skip if hidden
                if (hiddenIngredients[name]) return;

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
    }, [meals, checkedIngredients, hiddenIngredients]);

    const deleteCheckedIngredients = () => {
        setHiddenIngredients(prev => {
            const next = { ...prev };
            Object.keys(checkedIngredients).forEach(name => {
                if (checkedIngredients[name]) {
                    next[name] = true;
                }
            });
            return next;
        });
        // Optionally clear checked status? No, keeping them checked but hidden is fine in case they reappear?
        // Actually, if we hide them, we might want to uncheck them so if they reappear (unhidden), they aren't checked?
        // But for this simple implementation, just hiding is enough.

        // Clear checked map for deleted items to keep it clean?
        setCheckedIngredients(prev => {
            const next = { ...prev };
            Object.keys(prev).forEach(name => {
                if (prev[name]) delete next[name];
            });
            return next;
        });
    };

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
        language,
        toggleLanguage,
        deleteCheckedIngredients

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
