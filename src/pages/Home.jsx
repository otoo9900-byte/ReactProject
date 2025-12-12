import { useState, useEffect } from 'react';
import { useMeals } from '../context/MealContext';
import { Link } from 'react-router-dom';
import { getFoodImageUrl } from '../utils/image';

// Helper component to load image asynchronously
const MealImage = ({ meal }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            if (meal && (meal.imageKeywords || meal.menuName)) {
                let query = meal.imageKeywords || meal.menuName;

                // Special handling for 'Eating Out' (외식)
                if (meal.menuName && meal.menuName.includes('외식')) {
                    query = 'spoon and fork aesthetics';
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

    if (!imageUrl) return null;

    return (
        <>
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </>
    );
};

export default function Home() {
    const { meals, aggregatedIngredients } = useMeals();

    // Get real day of the week (e.g., "Monday", "Tuesday")
    const displayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const todaysMeals = meals?.filter(m => m.day === displayDay) || [];
    const unpurchasedCount = aggregatedIngredients?.filter(i => !i.checked).length || 0;

    const [selectedMealForIngredients, setSelectedMealForIngredients] = useState(null);

    const closeModal = () => setSelectedMealForIngredients(null);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <header className="space-y-2">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                    👋 Good Morning!
                </h1>
                <p className="text-lg text-gray-600">
                    Here's your summary for <span className="font-bold text-blue-600">{displayDay}</span>.
                </p>
            </header>

            {/* Today's Menu Section - Full Width, 3 Columns */}
            <section className="space-y-4">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        🍽️ Today's Menu
                    </h2>
                    <Link to="/planner" className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors">
                        Edit Plan →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Breakfast', 'Lunch', 'Dinner'].map(type => {
                        const meal = todaysMeals.find(m => m.type === type);

                        return (
                            <div key={type} className="group relative flex flex-col h-[500px] rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                                {/* Image Section (Fixed Height) */}
                                <div className="relative h-[240px] shrink-0 overflow-hidden bg-gray-100">
                                    <MealImage meal={meal} />

                                    {/* Type Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 shadow-sm z-10">
                                        {type}
                                    </div>

                                    {/* Menu Name Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full p-4 text-white z-10">
                                        <div className="font-bold text-xl text-shadow-sm truncate">
                                            {meal ? meal.menuName : <span className="opacity-70 italic">Not planned</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section (Flexible) */}
                                <div className="flex-1 p-5 bg-white flex flex-col overflow-hidden">
                                    {meal ? (
                                        <>
                                            <div className="flex flex-wrap gap-1 mb-3 shrink-0">
                                                {meal.ingredients.slice(0, 4).map((ing, idx) => (
                                                    <span key={idx} className="text-[10px] px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-medium">
                                                        {ing}
                                                    </span>
                                                ))}
                                                {meal.ingredients.length > 4 && (
                                                    <span
                                                        onClick={() => setSelectedMealForIngredients(meal)}
                                                        className="text-[10px] px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-bold cursor-pointer hover:bg-blue-100 transition-colors"
                                                    >
                                                        +{meal.ingredients.length - 4}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1 sticky top-0 bg-white">Recipe</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                                    {meal.recipe || "No recipe available."}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-gray-300">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">🥣</div>
                                                <p className="text-sm">No meal planned</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Today's Ingredients Section */}
            <section className="glass-panel p-8 rounded-3xl border border-white/50 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                        🥕
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Today's Ingredients</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(() => {
                        const allIngredients = todaysMeals.flatMap(m => m.ingredients || []);
                        const ingredientCounts = allIngredients.reduce((acc, ing) => {
                            const normalized = ing.trim();
                            acc[normalized] = (acc[normalized] || 0) + 1;
                            return acc;
                        }, {});

                        if (Object.keys(ingredientCounts).length === 0) {
                            return <p className="text-gray-500 italic">No ingredients needed for today.</p>;
                        }

                        return Object.entries(ingredientCounts).map(([name, count], idx) => (
                            <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-gray-200 shadow-sm text-sm font-medium text-gray-700">
                                <span>{name}</span>
                                {count > 1 && (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 rounded-md">
                                        x{count}
                                    </span>
                                )}
                            </div>
                        ));
                    })()}
                </div>
            </section>

            {/* Shopping Status Section - Bottom */}
            <section className="glass-panel p-8 rounded-3xl border border-white/50 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-4xl text-blue-500">
                            🛒
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Shopping Status</h2>
                            <p className="text-gray-500">Keep your fridge stocked!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 flex-1 justify-center md:justify-end">
                        <div className="text-center">
                            <div className="text-4xl font-extrabold text-blue-600 mb-1">{unpurchasedCount}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Needed</div>
                        </div>
                        <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
                        <Link
                            to="/shopping"
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                        >
                            View Shopping List
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ingredient Expansion Modal */}
            {selectedMealForIngredients && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
                    onClick={closeModal}
                >
                    <div
                        className="bg-[#fef9c3] w-full max-w-sm rounded-lg shadow-2xl overflow-hidden transform transition-all scale-100 rotate-1 border-2 border-gray-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header looking like tape or header */}
                        <div className="bg-[#fde047] p-4 border-b border-yellow-300 flex justify-between items-center">
                            <h3 className="font-bold text-yellow-900 text-lg">
                                📝 {selectedMealForIngredients.menuName} Ingredients
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-yellow-800 hover:text-yellow-950 font-bold text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Content looking like ruled paper */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:100%_2rem]">
                            <ul className="space-y-4 list-disc pl-5 marker:text-yellow-600">
                                {selectedMealForIngredients.ingredients.map((ing, idx) => (
                                    <li key={idx} className="text-gray-800 font-medium text-lg leading-8 -mt-2">
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#fef9c3] p-3 text-center text-xs text-yellow-700 italic border-t border-yellow-200">
                            Click outside to close
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
