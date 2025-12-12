import { useState, useEffect } from 'react';
import { generateMealInfo } from '../utils/api';
import { getFoodImageUrl } from '../utils/image';
import { useMeals } from '../context/MealContext';

export default function MealSlot({ day, type, meal, onUpdate }) {
    const { language, addRecipe } = useMeals();
    const [isEditing, setIsEditing] = useState(false);
    const [menuName, setMenuName] = useState(meal?.menuName || '');
    const [ingredients, setIngredients] = useState(meal?.ingredients?.join(', ') || '');
    const [recipe, setRecipe] = useState(meal?.recipe || '');
    const [imageKeywords, setImageKeywords] = useState(meal?.imageKeywords || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    // Fetch image when meal changes
    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            if (meal && (meal.imageKeywords || meal.menuName)) {
                let query = meal.imageKeywords || meal.menuName;

                // Special handling for 'Eating Out' (외식)
                if (meal.menuName && meal.menuName.includes('외식')) {
                    query = 'spoon and fork aesthetics'; // Search for nice cutlery images
                }

                const url = await getFoodImageUrl(query);
                if (isMounted) setImageUrl(url);
            } else {
                if (isMounted) setImageUrl(null);
            }
        };
        fetchImage();
        return () => { isMounted = false; };
    }, [meal]);

    const handleSave = async () => {
        let ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);
        let currentRecipe = recipe;
        let currentImageKeywords = imageKeywords;

        // AI Generation Trigger: Menu name exists but ingredients are empty
        // Skip generation if 'Eating Out' (외식) is detected
        if (menuName && ingredientList.length === 0 && !menuName.includes('외식')) {
            setIsGenerating(true);
            try {
                const generated = await generateMealInfo(menuName, language);
                if (generated) {
                    if (generated.ingredients && generated.ingredients.length > 0) {
                        ingredientList = generated.ingredients;
                        setIngredients(generated.ingredients.join(', '));
                    }
                    if (generated.recipe) {
                        currentRecipe = generated.recipe;
                        setRecipe(generated.recipe);
                    }
                    if (generated.imageKeywords) {
                        currentImageKeywords = generated.imageKeywords;
                        setImageKeywords(generated.imageKeywords);
                    }
                }
            } catch (error) {
                console.error("AI generation failed", error);
            } finally {
                setIsGenerating(false);
            }
        }

        onUpdate(day, type, menuName, ingredientList, currentRecipe, currentImageKeywords);

        // Fetch Image if not present or needs update
        if (menuName && (!imageUrl || menuName !== meal?.menuName)) {
            let keyword = (ingredientList.length > 0 && currentRecipe) ? menuName : menuName;

            // Special handling for 'Eating Out' (외식)
            if (menuName.includes('외식')) {
                keyword = 'spoon and fork aesthetics';
            }

            try {
                const fetchedUrl = await getFoodImageUrl(keyword);
                // We don't save the URL here directly as it's not part of onUpdate signature in previous context? 
                // Wait, onUpdate signature in context DOES accepts imageUrl now? 
                // Checking previous steps: Yes, I updated updateMeal to accept imageUrl.
                // But wait, onUpdate prop in MealSlot calls updateMeal.
                // Does MealSlot's handleSave call onUpdate with imageUrl?
                // Let's check the code I viewed.
                // Line 63: onUpdate(day, type, menuName, ingredientList, currentRecipe, currentImageKeywords);
                // Wait, argument 6 is imageKeywords, not imageUrl.
                // I need to verify what onUpdate expects.
                // In MealContext.jsx: updateMeal(day, type, menuName, ingredients, recipe = '', imageKeywords = '') 
                // Ah, I changed it to imageKeywords in Step 193 (User edit). 
                // The user changed `imageUrl` to `imageKeywords` in `updateMeal`.
                // So `onUpdate` takes `imageKeywords`. 
                // BUT `MealSlot` has local state `imageUrl` and fetches it. 
                // If the user wants the image to persist, we might need a way to store it, or just rely on keywords.
                // Use case: "Eating Out" needs specific query.
                // I should allow `getFoodImageUrl` to be called and set the view.

                if (fetchedUrl) setImageUrl(fetchedUrl); // Just update local view for now, or trigger another update if needed?
                // Actually, the `useEffect` handles fetching based on `meal` prop change.
                // But `handleSave` changes local state but `meal` prop might not update immediately until parent re-renders.
                // Let's just update local view.
            } catch (e) {
                console.error("Image fetch failed", e);
            }
        }

        // Auto-save to Recipe List if we have a menu name and recipe
        if (menuName && currentRecipe) {
            addRecipe(menuName, ingredientList, currentRecipe);
        }

        setIsEditing(false);
    };

    const t = {
        menuPlaceholder: language === 'ko' ? '메뉴 이름' : 'Menu Name',
        ingPlaceholder: language === 'ko' ? '재료 (쉼표로 구분)' : 'Ingredients (comma separated)',
        recipePlaceholder: language === 'ko' ? '레시피 (AI 자동 생성)' : 'Recipe (Auto-generated by AI)',
        generating: language === 'ko' ? 'AI가 분석 중입니다...' : 'AI is analyzing...',
        cancel: language === 'ko' ? '취소' : 'Cancel',
        save: language === 'ko' ? '저장' : 'Save',
        generatingBtn: language === 'ko' ? '생성 중...' : 'Generating...'
    };

    if (isEditing) {
        return (
            <div className="p-4 rounded-xl glass-panel shadow-lg z-10 relative w-full md:w-[300px]">
                <input
                    type="text"
                    placeholder={t.menuPlaceholder}
                    className="w-full mb-2 p-2 rounded-lg text-sm glass-input text-gray-700 placeholder-gray-400 font-bold"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    autoFocus
                    disabled={isGenerating}
                />
                <textarea
                    placeholder={isGenerating ? t.generating : t.ingPlaceholder}
                    className="w-full mb-2 p-2 rounded-lg text-sm glass-input text-gray-700 placeholder-gray-400 min-h-[60px] resize-none"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    disabled={isGenerating}
                />
                <textarea
                    placeholder={t.recipePlaceholder}
                    className="w-full mb-3 p-2 rounded-lg text-sm glass-input text-gray-700 placeholder-gray-400 min-h-[100px] resize-none"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    disabled={isGenerating}
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                        disabled={isGenerating}
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.generatingBtn}
                            </>
                        ) : (
                            t.save
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`p-3 rounded-xl h-[160px] cursor-pointer glass-card flex flex-col relative overflow-hidden group transition-all hover:shadow-md ${!meal ? 'hover:bg-white/40 justify-center' : 'justify-between'}`}
        >
            {imageUrl && (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                </>
            )}

            <div className="relative z-10 w-full h-full flex flex-col">
                {meal ? (
                    <>
                        <div className={`font-bold text-sm mb-1 line-clamp-2 ${imageUrl ? 'text-white text-shadow-sm' : 'text-gray-800'}`}>
                            {meal.menuName}
                        </div>

                        <div className="flex-1" /> {/* Spacer to push ingredients to bottom */}

                        {/* Updated Ingredient Layout: Flex wrap with badges */}
                        <div className="flex flex-wrap gap-1 content-end">
                            {meal.ingredients.slice(0, 6).map((ing, idx) => (
                                <span
                                    key={idx}
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm ${imageUrl ? 'bg-black/40 text-white/90 border border-white/10' : 'bg-white/60 text-gray-700 border border-gray-100'}`}
                                >
                                    {ing}
                                </span>
                            ))}
                            {meal.ingredients.length > 6 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm ${imageUrl ? 'bg-black/40 text-white/90' : 'bg-white/60 text-gray-700'}`}>
                                    +{meal.ingredients.length - 6}
                                </span>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-2xl text-gray-400/50 flex items-center justify-center h-full w-full group-hover:text-gray-500/80 transition-colors">
                        +
                    </div>
                )}
            </div>
        </div>
    );
}
