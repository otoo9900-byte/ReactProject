export default function IngredientList({ ingredients, onToggleCheck }) {
    if (ingredients.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No ingredients yet. Add meals to generate your shopping list!
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                🛒 Shopping List
                <span className="text-sm font-bold text-blue-600 bg-white/50 px-3 py-1 rounded-full shadow-sm">
                    {ingredients.length} items
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ingredients.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => onToggleCheck(item.name)}
                        className={`
              flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border
              ${item.checked
                                ? 'bg-gray-100/30 border-transparent opacity-50'
                                : 'glass-card border-white/40 hover:border-white/80'
                            }
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`
                w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                ${item.checked
                                    ? 'bg-blue-400 border-blue-400 text-white'
                                    : 'border-white/60 bg-white/30'
                                }
              `}>
                                {item.checked && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`font-medium text-lg ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {item.name}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50/50 px-2 py-1 rounded-lg">
                            x{item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
