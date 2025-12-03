import { useMeals } from '../context/MealContext';
import IngredientList from '../components/IngredientList';

export default function Shopping() {
    const { aggregatedIngredients, toggleIngredientCheck } = useMeals();

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800">🛒 Shopping List</h1>
            <IngredientList
                ingredients={aggregatedIngredients}
                onToggleCheck={toggleIngredientCheck}
            />
        </div>
    );
}
