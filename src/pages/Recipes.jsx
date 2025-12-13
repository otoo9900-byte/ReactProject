import { useState, useEffect } from 'react';
import { getFoodImageUrl } from '../utils/image';
import { useMeals } from '../context/MealContext';
import { Plus, Trash2 } from 'lucide-react';

const RecipeImage = ({ recipeName, imageKeywords, storedImageUrl }) => {
    const [imageUrl, setImageUrl] = useState(storedImageUrl || null);

    useEffect(() => {
        if (storedImageUrl) {
            setImageUrl(storedImageUrl);
            return;
        }

        let isMounted = true;
        const fetchImage = async () => {
            const query = imageKeywords || recipeName;
            if (query) {
                const url = await getFoodImageUrl(query);
                if (isMounted) setImageUrl(url);
            }
        };
        if (!storedImageUrl) {
            fetchImage();
        }
        return () => { isMounted = false; };
    }, [recipeName, imageKeywords, storedImageUrl]);

    if (!imageUrl) return (
        <div className="h-32 w-full bg-white/10 flex items-center justify-center text-4xl shrink-0">
            🥘
        </div>
    );

    return (
        <div className="relative h-40 w-full shrink-0 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
    );
};

export default function Recipes() {
    const { favoriteRecipes, addRecipe, removeRecipe, t } = useMeals();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIngredients, setNewIngredients] = useState('');
    const [newInstructions, setNewInstructions] = useState('');

    const handleAdd = () => {
        if (!newName.trim()) return;
        const ingredients = newIngredients.split(',').map(i => i.trim()).filter(i => i);
        addRecipe(newName, ingredients, newInstructions);
        setNewName('');
        setNewIngredients('');
        setNewInstructions('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-theme-primary">📖 {t('recipes_title')}</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all"
                >
                    <Plus size={20} />
                    {t('recipes_add')}
                </button>
            </div>

            {isAdding && (
                <div className="glass-panel p-6 rounded-2xl space-y-4 animate-slide-down">
                    <h3 className="font-bold text-lg text-theme-primary">{t('recipes_new_title')}</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder={t('recipes_name_placeholder')}
                            className="w-full p-3 rounded-xl glass-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                        />
                        <input
                            type="text"
                            placeholder={t('recipes_ingredients_placeholder')}
                            className="w-full p-3 rounded-xl glass-input"
                            value={newIngredients}
                            onChange={(e) => setNewIngredients(e.target.value)}
                        />
                        <textarea
                            placeholder={t('recipes_instructions_placeholder')}
                            className="w-full p-3 rounded-xl glass-input min-h-[100px] resize-none"
                            value={newInstructions}
                            onChange={(e) => setNewInstructions(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-white/50 rounded-lg"
                        >
                            {t('recipes_cancel')}
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            {t('recipes_save')}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.length === 0 && !isAdding && (
                    <div className="col-span-full text-center py-12 text-theme-secondary glass-panel rounded-2xl border-dashed">
                        {t('recipes_empty')}
                    </div>
                )}

                {favoriteRecipes.map(recipe => (
                    <div key={recipe.id} className="glass-card rounded-2xl relative group flex flex-col overflow-hidden">
                        <RecipeImage recipeName={recipe.name} imageKeywords={recipe.imageKeywords} storedImageUrl={recipe.imageUrl} />

                        <div className="p-5 flex flex-col gap-4">
                            <button
                                onClick={() => removeRecipe(recipe.id)}
                                className="absolute top-3 right-3 text-white/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 p-1.5 rounded-full backdrop-blur-sm z-10"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div>
                                <h3 className="font-bold text-lg text-theme-primary mb-2">{recipe.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.ingredients.map((ing, idx) => (
                                        <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded-md text-theme-secondary border border-white/10">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {recipe.instructions && (
                                <div className="text-sm text-theme-secondary bg-white/10 p-3 rounded-xl whitespace-pre-wrap">
                                    {recipe.instructions}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
