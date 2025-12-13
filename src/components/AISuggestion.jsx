import { useState } from 'react';
import { analyzeWeeklyNutrition } from '../utils/api';
import { useMeals } from '../context/MealContext';
import { Sparkles, X, MessageCircleHeart } from 'lucide-react';

export default function AISuggestion() {
    const { meals, language, t } = useMeals();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleAnalyze = async () => {
        if (meals.length === 0) {
            alert(language === 'ko' ? '분석할 식단이 없습니다.' : 'No meals to analyze.');
            return;
        }
        setLoading(true);
        setIsOpen(true);
        setAnalysis(null); // Clear previous result
        try {
            const result = await analyzeWeeklyNutrition(meals, language);
            setAnalysis(result);
        } catch (e) {
            console.error(e);
            setAnalysis({ error: true });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={handleAnalyze}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-bounce-slow"
            >
                <Sparkles size={20} />
                <span className="font-bold text-sm">
                    {language === 'ko' ? 'AI 영양 분석' : 'AI Analysis'}
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[90%] max-w-sm">
            <div className="glass-panel shadow-2xl rounded-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-5 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
                    <div className="flex items-center gap-2 text-fuchsia-600 font-bold">
                        <MessageCircleHeart size={20} />
                        <span>{language === 'ko' ? 'AI 영양 코칭' : 'AI Nutrition Coach'}</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-theme-secondary hover:bg-black/5 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 bg-white/80 backdrop-blur-xl min-h-[150px] flex flex-col justify-center">
                    {loading ? (
                        <div className="text-center space-y-3">
                            <div className="inline-block animate-spin text-fuchsia-500">
                                <Sparkles size={32} />
                            </div>
                            <p className="text-sm text-theme-secondary font-medium animate-pulse">
                                {language === 'ko' ? '식단을 분석하고 있어요...' : 'Analyzing your week...'}
                            </p>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-4">
                            {!analysis.error ? (
                                <>
                                    <div className="bg-fuchsia-50 p-3 rounded-xl border border-fuchsia-100">
                                        <h4 className="text-xs font-bold text-fuchsia-500 mb-1 uppercase tracking-wider">
                                            {language === 'ko' ? '총평' : 'Summary'}
                                        </h4>
                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                            {analysis.analysis}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-violet-500 mb-2 uppercase tracking-wider">
                                            {language === 'ko' ? '추천 조언' : 'Tips'}
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.advice?.map((tip, idx) => (
                                                <li key={idx} className="flex gap-2 text-sm text-gray-600 items-start">
                                                    <span className="text-violet-400 mt-1">•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-red-500 text-sm">
                                    {language === 'ko' ? '분석에 실패했습니다. 다시 시도해 주세요.' : 'Analysis failed. Please try again.'}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                {!loading && (
                    <div className="p-3 bg-gray-50/50 backdrop-blur-sm border-t border-white/20 flex justify-end">
                        <button
                            onClick={handleAnalyze}
                            className="text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 hover:bg-fuchsia-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <Sparkles size={14} />
                            {language === 'ko' ? '다시 분석하기' : 'Analyze Again'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
