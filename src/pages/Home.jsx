import { useMeals } from '../context/MealContext';
import { Link } from 'react-router-dom';

export default function Home() {
    const { meals, aggregatedIngredients } = useMeals();

    const displayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const todaysMeals = meals?.filter(m => m.day === displayDay) || [];
    const unpurchasedCount = aggregatedIngredients?.filter(i => !i.checked).length || 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">
                    👋 Good Morning!
                </h1>
                <p className="text-gray-600">
                    Here's your summary for <span className="font-semibold text-blue-600">{displayDay}</span>.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Today's Menu Card */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">🍽️ Today's Menu</h2>
                        <Link to="/planner" className="text-sm text-blue-500 hover:underline">Edit Plan</Link>
                    </div>

                    <div className="space-y-4">
                        {['Breakfast', 'Lunch', 'Dinner'].map(type => {
                            const meal = todaysMeals.find(m => m.type === type);
                            return (
                                <div key={type} className="flex items-center gap-4 p-3 rounded-xl bg-white/40 border border-white/50">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                        {type === 'Breakfast' ? '🍳' : type === 'Lunch' ? '🍱' : '🥗'}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">{type}</div>
                                        <div className="font-medium text-gray-800">
                                            {meal ? meal.menuName : <span className="text-gray-400 italic">Not planned</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shopping Alert Card */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">🛒 Shopping Status</h2>
                        <Link to="/shopping" className="text-sm text-blue-500 hover:underline">View List</Link>
                    </div>

                    <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
                        <div className="text-5xl font-bold text-blue-600">
                            {unpurchasedCount}
                        </div>
                        <div className="text-gray-600 font-medium">
                            Items left to buy
                        </div>
                        <p className="text-sm text-gray-500 max-w-[200px]">
                            {unpurchasedCount > 0
                                ? "Don't forget to stop by the grocery store!"
                                : "You're all set! Fridge is stocked."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
