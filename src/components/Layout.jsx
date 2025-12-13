import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, BookOpen, Settings } from 'lucide-react';
import { useMeals } from '../context/MealContext';
import DebugConsole from './DebugConsole';

export default function Layout() {
    const { language, toggleLanguage, t } = useMeals();
    const navItems = [
        { path: '/', icon: Home, label: t('nav_home') },
        { path: '/planner', icon: Calendar, label: t('nav_planner') },
        { path: '/shopping', icon: ShoppingCart, label: t('nav_shopping') },
        { path: '/recipes', icon: BookOpen, label: t('nav_recipes') },
        { path: '/settings', icon: Settings, label: t('nav_settings') },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/40 fixed h-full z-20 hidden md:flex flex-col">
                <div className="p-8">
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                        Smart Meal
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                                }
              `}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="px-4 py-2">
                    <button
                        onClick={toggleLanguage}
                        className="w-full py-2 px-4 rounded-xl bg-white/30 hover:bg-white/50 text-sm font-bold text-gray-700 transition-all flex items-center justify-center gap-2"
                    >
                        <span className={language === 'ko' ? 'text-blue-600' : 'text-gray-400'}>KO</span>
                        <span className="text-gray-300">|</span>
                        <span className={language === 'en' ? 'text-blue-600' : 'text-gray-400'}>EN</span>
                    </button>
                </div>

                <div className="p-6 text-xs text-center text-gray-400">
                    v1.0.0
                </div>
            </aside>

            {/* Mobile Bottom Nav (Visible only on small screens) */}
            <nav className="md:hidden fixed bottom-0 w-full glass-panel border-t border-white/40 z-50 flex justify-around p-4">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `
              flex flex-col items-center gap-1
              ${isActive ? 'text-blue-600' : 'text-gray-400'}
            `}
                    >
                        <Icon size={24} />
                        <span className="text-[10px] font-medium">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pb-24 md:pb-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <DebugConsole />
        </div>
    );
}
