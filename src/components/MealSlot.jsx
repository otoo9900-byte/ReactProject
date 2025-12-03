import { useState } from 'react';
import { generateIngredients } from '../utils/api';
import { useMeals } from '../context/MealContext';

export default function MealSlot({ day, type, meal, onUpdate }) {
    const { language } = useMeals();
    const [isEditing, setIsEditing] = useState(false);
    const [menuName, setMenuName] = useState(meal?.menuName || '');
    const [ingredients, setIngredients] = useState(meal?.ingredients?.join(', ') || '');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSave = async () => {
        let ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);

        // AI Generation Trigger: Menu name exists but ingredients are empty
        if (menuName && ingredientList.length === 0) {
            setIsGenerating(true);
            try {
                const generated = await generateIngredients(menuName, language);
                if (generated && generated.length > 0) {
                    ingredientList = generated;
                    setIngredients(generated.join(', ')); // Update local state to show what was generated
                }
            } catch (error) {
                console.error("AI generation failed", error);
            } finally {
                setIsGenerating(false);
            }
        }

        onUpdate(day, type, menuName, ingredientList);
        setIsEditing(false);
    };

    const t = {
        menuPlaceholder: language === 'ko' ? '메뉴 이름' : 'Menu Name',
        ingPlaceholder: language === 'ko' ? '재료 (쉼표로 구분)' : 'Ingredients (comma separated)',
        generating: language === 'ko' ? '재료 생성 중...' : 'Generating ingredients...',
        cancel: language === 'ko' ? '취소' : 'Cancel',
        save: language === 'ko' ? '저장' : 'Save',
        generatingBtn: language === 'ko' ? '생성 중...' : 'Generating...'
    };

    if (isEditing) {
        return (
            <div className="p-3 rounded-xl glass-panel shadow-lg z-10 relative">
                <input
                    type="text"
                    placeholder={t.menuPlaceholder}
                    className="w-full mb-2 p-2 rounded-lg text-sm glass-input text-gray-700 placeholder-gray-400"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    autoFocus
                    disabled={isGenerating}
                />
                <input
                    type="text"
                    placeholder={isGenerating ? t.generating : t.ingPlaceholder}
                    className="w-full mb-3 p-2 rounded-lg text-sm glass-input text-gray-700 placeholder-gray-400"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
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
            className="p-3 rounded-xl min-h-[100px] cursor-pointer glass-card flex flex-col justify-center"
        >
            {meal ? (
                <>
                    <div className="font-bold text-gray-800 text-sm mb-1">{meal.menuName}</div>
                    <div className="text-xs text-gray-600 truncate opacity-80">
                        {meal.ingredients.join(', ')}
                    </div>
                </>
            ) : (
                <div className="text-2xl text-white/50 flex items-center justify-center h-full hover:text-white/80 transition-colors">
                    +
                </div>
            )}
        </div>
    );
}
