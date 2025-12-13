import { createContext, useContext, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
import { t as translate } from '../constants/translations';
import { THEMES } from '../constants/themes';
import { useEffect } from 'react';

const MealContext = createContext();

export function MealProvider({ children }) {
    const [meals, setMeals] = useLocalStorage('smart-meal-planner-meals', []);
    const [checkedIngredients, setCheckedIngredients] = useLocalStorage('smart-meal-planner-checked', {});
    const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage('smart-meal-planner-recipes', []);
    const [hiddenIngredients, setHiddenIngredients] = useLocalStorage('smart-meal-planner-hidden-ingredients', {});
    const [language, setLanguage] = useLocalStorage('smart-meal-planner-language', 'ko');
    const [currentTheme, setCurrentTheme] = useLocalStorage('smart-meal-planner-theme', 'default');


    const updateMeal = (day, type, menuName, ingredients, recipe = '', imageKeywords = '', nutrition = null, imageUrl = null) => {
        setMeals(prevMeals => {
            const existingMealIndex = prevMeals.findIndex(m => m.day === day && m.type === type);
            const newMeal = {
                id: existingMealIndex >= 0 ? prevMeals[existingMealIndex].id : uuidv4(),
                day,
                type,
                menuName,
                ingredients,
                recipe,
                imageKeywords,
                nutrition,
                imageUrl
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

    const updateMealImage = (day, type, imageUrl) => {
        setMeals(prevMeals => {
            const existingMealIndex = prevMeals.findIndex(m => m.day === day && m.type === type);
            if (existingMealIndex === -1) return prevMeals;

            const newMeals = [...prevMeals];
            newMeals[existingMealIndex] = { ...newMeals[existingMealIndex], imageUrl };
            return newMeals;
        });
    };

    const moveMeal = (mealId, targetDay, targetType) => {
        setMeals(prevMeals => {
            const sourceIndex = prevMeals.findIndex(m => m.id === mealId);
            if (sourceIndex === -1) return prevMeals;

            const targetIndex = prevMeals.findIndex(m => m.day === targetDay && m.type === targetType);
            const sourceMeal = prevMeals[sourceIndex];

            const newMeals = [...prevMeals];

            if (targetIndex >= 0) {
                // Swap logic
                const targetMeal = prevMeals[targetIndex];

                // Move target to source position
                newMeals[sourceIndex] = { ...targetMeal, day: sourceMeal.day, type: sourceMeal.type };

                // Move source to target position
                newMeals[targetIndex] = { ...sourceMeal, day: targetDay, type: targetType };
            } else {
                // Move logic (target is empty)
                newMeals[sourceIndex] = { ...sourceMeal, day: targetDay, type: targetType };
            }

            return newMeals;
        });
    };

    const toggleIngredientCheck = (name) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const addRecipe = (name, ingredients, instructions = '', imageKeywords = '', imageUrl = null) => {
        setFavoriteRecipes(prev => {
            const existingIndex = prev.findIndex(r => r.name === name);
            if (existingIndex >= 0) {
                // Update existing recipe
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], ingredients, instructions, imageKeywords, imageUrl };
                return updated;
            }
            // Add new recipe
            return [...prev, { id: uuidv4(), name, ingredients, instructions, imageKeywords, imageUrl }];
        });
    };

    const removeRecipe = (id) => {
        setFavoriteRecipes(prev => prev.filter(r => r.id !== id));
    };

    const aggregatedIngredients = useMemo(() => {
        const map = new Map();

        meals.forEach(meal => {
            meal.ingredients.forEach(rawIng => {
                // Step 0: Split by comma to handle multiple ingredients in one slot
                // separate "Onion, Garlic" into "Onion" and "Garlic"
                const subIngredients = rawIng.split(',').map(s => s.trim()).filter(s => s);

                subIngredients.forEach(ing => {
                    let name = ing.trim();
                    if (!name) return;

                    // Automatic Cleaning Logic
                    // 1. Remove text inside parentheses (e.g., "Milk (low fat)")
                    name = name.replace(/\s*\([^)]*\)/g, '');

                    // 2. Remove quantities at the end
                    name = name.replace(/\s+\d+.*$/, '');

                    // 3. Remove quantities at the start
                    name = name.replace(/^\d+([./]\d+)?\s*/, '');

                    // 4. Remove standalone Korean counts
                    name = name.replace(/\d+[가-힣a-zA-Z]*$/, '');

                    // 5. Remove vague quantifiers
                    name = name.replace(/\s+(약간|조금|적당량|한줌|한꼬집|취향껏|상당량|소량|다수).*$/, '');

                    // 7. Alternative Handling (New request)
                    // Pattern: "A 또는 B", "A or B", "A / B"
                    // We treat these as alternatives, not separate items.
                    const altRegex = /(?:^|\s)(?:또는|or|\/)(?:\s|$)/i;
                    if (altRegex.test(name)) {
                        const parts = name.split(altRegex).map(s => s.trim()).filter(s => s);
                        if (parts.length > 1) {
                            // Just use the primary ingredient, discard alternatives
                            name = parts[0];
                        }
                    }

                    // 6. Synonym Normalization (Apply to the whole string or just primary? Whole string is safer for now, or maybe just primary?)
                    // If we formatted it, name is like "Beef (Alternative: Pork)". Synonyms won't match.
                    // So we should probably apply synonyms BEFORE alternative formatting? 
                    // Or apply to parts?
                    // Let's keep synonyms simple for now. If it's a complex string, synonyms might not apply.
                    // But if it was just "Egg", it falls through here.

                    if (!name.includes('(')) { // Only apply simple synonyms if not already formatted
                        const synonyms = {
                            '달걀': '계란',
                            'egg': '계란',
                            'eggs': '계란',
                            '파': '대파'
                        };
                        if (synonyms[name]) {
                            name = synonyms[name];
                        }
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
        });

        return Array.from(map.entries()).map(([name, count]) => ({
            name,
            count,
            checked: !!checkedIngredients[name]
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [meals, checkedIngredients, hiddenIngredients, language]);

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



    // Apply theme variables
    useEffect(() => {
        const theme = THEMES[currentTheme] || THEMES.default;
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [currentTheme]);

    const changeTheme = (themeName) => {
        if (THEMES[themeName]) {
            setCurrentTheme(themeName);
        }
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
    };

    const t = (key, params = {}) => translate(key, language, params);



    const value = {
        meals,
        updateMeal,
        aggregatedIngredients,
        toggleIngredientCheck,
        favoriteRecipes,
        addRecipe,
        removeRecipe,
        language,
        toggleLanguage,
        t,
        deleteCheckedIngredients,
        currentTheme,
        changeTheme,
        moveMeal,
        updateMealImage
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
