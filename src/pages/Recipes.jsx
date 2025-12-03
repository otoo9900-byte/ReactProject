import { useState } from 'react';
import { useMeals } from '../context/MealContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Recipes() {
    const { favoriteRecipes, addRecipe, removeRecipe } = useMeals();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIngredients, setNewIngredients] = useState('');

    const handleAdd = () => {
        if (!newName.trim()) return;
        const ingredients = newIngredients.split(',').map(i => i.trim()).filter(i => i);
        addRecipe(newName, ingredients);
        setNewName('');
        setNewIngredients('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">📖 Recipe Book</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all"
                >
                    <Plus size={20} />
                    Add Recipe
                </button>
            </div>

            {isAdding && (
                <div className="glass-panel p-6 rounded-2xl space-y-4 animate-slide-down">
                    <h3 className="font-bold text-lg text-gray-700">New Recipe</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Recipe Name (e.g., Kimchi Stew)"
                            className="w-full p-3 rounded-xl glass-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                        />
                        <input
                            type="text"
                            placeholder="Ingredients (comma separated)"
                            className="w-full p-3 rounded-xl glass-input"
                            value={newIngredients}
                            onChange={(e) => setNewIngredients(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-white/50 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Save Recipe
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.length === 0 && !isAdding && (
                    <div className="col-span-full text-center py-12 text-gray-500 glass-panel rounded-2xl border-dashed">
                        No recipes yet. Add your favorites!
                    </div>
                )}

                {favoriteRecipes.map(recipe => (
                    <div key={recipe.id} className="glass-card p-5 rounded-2xl relative group">
                        <button
                            onClick={() => removeRecipe(recipe.id)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={18} />
                        </button>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{recipe.name}</h3>
                        <div className="flex flex-wrap gap-2">
                            {recipe.ingredients.map((ing, idx) => (
                                <span key={idx} className="text-xs bg-white/60 px-2 py-1 rounded-md text-gray-600">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
