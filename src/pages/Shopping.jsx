import { useMeals } from '../context/MealContext';
import IngredientList from '../components/IngredientList';

export default function Shopping() {
    const { aggregatedIngredients, toggleIngredientCheck, smartIngredients, mergeIngredients, isMerging, resetSmartList } = useMeals();

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800">🛒 Shopping List</h1>
            <IngredientList
                ingredients={smartIngredients || aggregatedIngredients}
                onToggleCheck={toggleIngredientCheck}
            />

            <div className="flex justify-center gap-4">
                {!smartIngredients ? (
                    <button
                        onClick={mergeIngredients}
                        disabled={isMerging || aggregatedIngredients.length === 0}
                        className={`
                            px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5
                            ${isMerging
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-indigo-500/30'
                            }
                        `}
                    >
                        {isMerging ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Merging...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                ✨ Smart Merge
                            </span>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={resetSmartList}
                        className="px-6 py-3 rounded-xl bg-gray-500 text-white font-bold shadow-lg hover:bg-gray-600 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        ↩️ Revert to Original
                    </button>
                )}
            </div>
        </div>
    );
}
