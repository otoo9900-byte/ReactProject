import { useMeals } from '../context/MealContext';
import { THEMES } from '../constants/themes';
import { Check } from 'lucide-react';

export default function Settings() {
    const { t, currentTheme, changeTheme } = useMeals();

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl font-extrabold text-theme-primary tracking-tight">
                    ⚙️ {t('settings_title')}
                </h1>
                <p className="text-theme-secondary">
                    {t('settings_theme_desc')}
                </p>
            </header>

            <section className="glass-panel p-8 rounded-3xl border border-white/50 shadow-lg">
                <h2 className="text-2xl font-bold text-theme-primary mb-6 flex items-center gap-2">
                    🎨 {t('settings_theme')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(THEMES).map(([key, theme]) => {
                        const isSelected = currentTheme === key;
                        const colors = theme.colors;

                        return (
                            <button
                                key={key}
                                onClick={() => changeTheme(key)}
                                className={`relative group flex flex-col items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 overflow-hidden
                                    ${isSelected
                                        ? 'border-blue-500 bg-white/40 shadow-xl scale-105'
                                        : 'border-transparent hover:bg-white/20 hover:scale-102 hover:shadow-lg'
                                    }
                                `}
                            >
                                {/* Theme Preview Circle */}
                                <div
                                    className="w-full h-32 rounded-xl shadow-inner relative overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors['--bg-gradient-start']} 0%, ${colors['--bg-gradient-end']} 100%)`
                                    }}
                                >
                                    {/* Mini Glass Card Preview */}
                                    <div
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 rounded-lg border backdrop-blur-sm"
                                        style={{
                                            background: colors['--glass-bg'],
                                            borderColor: colors['--glass-border']
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {theme.name}
                                    </span>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
