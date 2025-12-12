import { useMeals } from '../context/MealContext';
import IngredientList from '../components/IngredientList';

export default function Shopping() {
    const { aggregatedIngredients, toggleIngredientCheck, deleteCheckedIngredients } = useMeals();

    // Check if there are any checked items using the aggregated items' checked state
    const hasCheckedItems = aggregatedIngredients.some(item => item.checked);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
                <h1 className="text-3xl font-bold text-gray-800">🛒 Shopping List</h1>
                {hasCheckedItems && (
                    <button
                        onClick={deleteCheckedIngredients}
                        className="text-xs font-bold text-red-500 bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Clear Purchased
                    </button>
                )}
            </div>
            <IngredientList
                ingredients={aggregatedIngredients}
                onToggleCheck={toggleIngredientCheck}
            />
        </div>
    );
}
