import { useState } from 'react';

export default function MealSlot({ day, type, meal, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [menuName, setMenuName] = useState(meal?.menuName || '');
    const [ingredients, setIngredients] = useState(meal?.ingredients?.join(', ') || '');

    const handleSave = () => {
        const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);
        onUpdate(day, type, menuName, ingredientList);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="p-3 rounded-xl glass-panel shadow-lg z-10 relative">
                <input
                    type="text"
                    placeholder="Menu Name"
                    className="w-full mb-2 p-2 rounded-lg text-sm glass-input text-gray-700 placeholder-gray-400"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    autoFocus
                />
                <input
                    type="text"
                    placeholder="Ingredients (comma separated)"
                    className="w-full mb-3 p-2 rounded-lg text-sm glass-input text-gray-700 placeholder-gray-400"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        Save
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
