import { useState, useEffect } from 'react';
import { generateMealInfo } from '../utils/api';
import { getFoodImageUrl } from '../utils/image';
import { useMeals } from '../context/MealContext';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function MealSlot({ day, type, meal, onUpdate }) {
    const { language, addRecipe, updateMealImage } = useMeals();
    const [isEditing, setIsEditing] = useState(false);
    const [menuName, setMenuName] = useState(meal?.menuName || '');
    const [ingredients, setIngredients] = useState(meal?.ingredients?.join(', ') || '');
    const [recipe, setRecipe] = useState(meal?.recipe || '');
    const [imageKeywords, setImageKeywords] = useState(meal?.imageKeywords || '');
    const [nutrition, setNutrition] = useState(meal?.nutrition || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState(meal?.imageUrl || null);

    // Fetch image when meal changes (only if no stored URL)
    useEffect(() => {
        if (meal?.imageUrl) {
            setImageUrl(meal.imageUrl);
            return;
        }

        let isMounted = true;
        const fetchImage = async () => {
            if (meal && (meal.imageKeywords || meal.menuName)) {
                let query = meal.imageKeywords || meal.menuName;

                // Special handling for 'Eating Out' (외식)
                if (meal.menuName && meal.menuName.includes('외식')) {
                    query = 'spoon and fork aesthetics'; // Search for nice cutlery images
                }

                const url = await getFoodImageUrl(query);
                if (isMounted && url) {
                    setImageUrl(url);
                    // Cache the image URL
                    updateMealImage(day, type, url);
                }
            } else {
                if (isMounted) setImageUrl(null);
            }
        };
        fetchImage();
        return () => { isMounted = false; };
    }, [meal, day, type, updateMealImage]);

    const handleSave = async () => {
        let ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);
        let currentRecipe = recipe;
        let currentImageKeywords = imageKeywords;
        let currentNutrition = nutrition;

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
                    setImageKeywords(generated.imageKeywords);
                    if (generated.nutrition) {
                        currentNutrition = generated.nutrition;
                        setNutrition(generated.nutrition);
                    }
                }
            } catch (error) {
                console.error("AI generation failed", error);
            } finally {
                setIsGenerating(false);
            }
        }

        onUpdate(day, type, menuName, ingredientList, currentRecipe, currentImageKeywords, currentNutrition);

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
            addRecipe(menuName, ingredientList, currentRecipe, currentImageKeywords);
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

    // Droppable Logic (The Slot)
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `${day}-${type}`,
    });

    // Draggable Logic (The Meal Card)
    // Only draggable if meal exists and NOT editing
    const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
        id: meal?.id || 'temp-id', // Need an ID even if null to avoid error hook call, but disabled makes it moot
        disabled: !meal || isEditing,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    if (isEditing) {
        return (
            <div className="p-4 rounded-xl glass-panel shadow-lg z-10 relative w-full md:w-[300px]">
                <input
                    type="text"
                    placeholder={t.menuPlaceholder}
                    className="w-full mb-2 p-2 rounded-lg text-sm glass-input text-theme-primary placeholder-theme-secondary font-bold"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    autoFocus
                    disabled={isGenerating}
                />
                <textarea
                    placeholder={isGenerating ? t.generating : t.ingPlaceholder}
                    className="w-full mb-2 p-2 rounded-lg text-sm glass-input text-theme-primary placeholder-theme-secondary min-h-[60px] resize-none"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    disabled={isGenerating}
                />
                <textarea
                    placeholder={t.recipePlaceholder}
                    className="w-full mb-3 p-2 rounded-lg text-sm glass-input text-theme-primary placeholder-theme-secondary min-h-[100px] resize-none"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    disabled={isGenerating}
                />
                <div className="flex justify-between items-center mb-2">
                    <button
                        onClick={async () => {
                            if (!menuName.trim()) return;
                            setIsGenerating(true);
                            try {
                                const generated = await generateMealInfo(menuName, language);
                                if (generated) {
                                    if (generated.ingredients && generated.ingredients.length > 0) {
                                        setIngredients(generated.ingredients.join(', '));
                                    }
                                    if (generated.recipe) {
                                        setRecipe(generated.recipe);
                                    }
                                    setImageKeywords(generated.imageKeywords);
                                    if (generated.nutrition) {
                                        setNutrition(generated.nutrition);
                                    }
                                }
                            } catch (error) {
                                console.error("Manual AI generation failed", error);
                            } finally {
                                setIsGenerating(false);
                            }
                        }}
                        className="text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"
                        disabled={isGenerating || !menuName}
                    >
                        ✨ {language === 'ko' ? 'AI 자동 완성' : 'AI Autofill'}
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1.5 text-xs font-medium text-theme-secondary hover:bg-white/50 rounded-lg transition-colors"
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
            </div>
        );
    }

    return (
        <div
            ref={setDroppableRef}
            className={`rounded-xl transition-all duration-300 ${isOver ? 'ring-2 ring-blue-500 scale-105 bg-blue-50/50' : ''}`}
        >
            <div
                ref={setDraggableRef}
                style={style}
                {...listeners}
                {...attributes}
                onClick={(e) => {
                    // Prevent editing trigger if dragging (handled by dnd-kit sensors distance)
                    // But also, we need to distinguish click vs drag.
                    // If we attach listeners to the whole card, clicking text might trigger drag?
                    // PointerSensor with distance 8px handles this.
                    // So simply setEditing(true) on click is fine.
                    // BUT, prevent editing if we just finished a drag? 
                    // Usually dnd-kit prevents click events if a drag occurred.
                    setIsEditing(true);
                }}
                className={`p-3 h-[160px] cursor-grab active:cursor-grabbing glass-card flex flex-col relative overflow-hidden group transition-all hover:shadow-md ${!meal ? 'hover:bg-white/40 justify-center' : 'justify-between'}`}
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
                            <div className={`font-bold text-sm mb-1 line-clamp-2 min-h-[2.5em] ${imageUrl ? 'text-white text-shadow-sm' : 'text-theme-primary'} flex justify-between items-start`}>
                                <span>{meal.menuName}</span>
                                {!imageUrl && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Trigger retry by calling updateMealImage with special null/force param? 
                                            // Or just call getFoodImageUrl directly?
                                            // Simpler: Force updateMealImage with null to reset, then fetch?
                                            // Actually, if we just setImageUrl(null), the useEffect might depend on meal.imageUrl.
                                            // Let's force a fetch here.
                                            const fetchImage = async () => {
                                                const query = meal.imageKeywords || meal.menuName;
                                                const url = await getFoodImageUrl(query);
                                                if (url) {
                                                    setImageUrl(url);
                                                    updateMealImage(day, type, url);
                                                }
                                            };
                                            fetchImage();
                                        }}
                                        className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                        title="Reload Image"
                                    >
                                        🔄
                                    </button>
                                )}
                            </div>

                            {meal.nutrition && (
                                <div className={`text-[10px] mb-2 flex flex-wrap gap-1 shrink-0 ${imageUrl ? 'text-white/90 text-shadow-sm' : 'text-theme-secondary'}`}>
                                    <span className="font-bold">🔥{meal.nutrition.calories}</span>
                                </div>
                            )}

                            <div className="flex-1" /> {/* Spacer to push ingredients to bottom */}

                            {/* Updated Ingredient Layout: Flex wrap with badges */}
                            <div className="flex flex-wrap gap-1 content-end max-h-[4.5rem] overflow-hidden">
                                {meal.ingredients.slice(0, 5).map((ing, idx) => (
                                    <span
                                        key={idx}
                                        className={`text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap ${imageUrl ? 'bg-black/40 text-white/90 border border-white/10' : 'bg-white/20 text-theme-secondary border border-white/20'}`}
                                    >
                                        {ing}
                                    </span>
                                ))}
                                {meal.ingredients.length > 5 && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap ${imageUrl ? 'bg-black/40 text-white/90' : 'bg-white/20 text-theme-secondary'}`}>
                                        +{meal.ingredients.length - 5}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-2xl text-theme-secondary/50 flex items-center justify-center h-full w-full group-hover:text-theme-secondary/80 transition-colors">
                            +
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
