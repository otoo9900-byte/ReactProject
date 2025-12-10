import { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, Trash2, AlertCircle } from 'lucide-react';

export default function DebugConsole() {
    const [logs, setLogs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewError, setHasNewError] = useState(false);

    useEffect(() => {
        const originalConsoleError = console.error;

        // Helper to add log
        const addLog = (message, source = 'Console') => {
            const timestamp = new Date().toLocaleTimeString();
            const translatedMessage = translateError(message);

            setLogs(prev => [...prev, {
                id: Date.now(),
                timestamp,
                message: translatedMessage,
                originalMessage: message,
                source
            }]);
            setHasNewError(true);
        };

        // 1. Capture console.error
        console.error = (...args) => {
            // Call original
            originalConsoleError.apply(console, args);

            // Format message
            const message = args.map(arg => {
                if (typeof arg === 'object') {
                    return arg.message || JSON.stringify(arg);
                }
                return String(arg);
            }).join(' ');

            addLog(message, 'Console');
        };

        // 2. Capture window.onerror (Global errors)
        const handleGlobalError = (message, source, lineno, colno, error) => {
            addLog(message, 'Global');
        };
        window.addEventListener('error', handleGlobalError);

        // 3. Capture Unhandled Promise Rejections
        const handlePromiseRejection = (event) => {
            addLog(event.reason?.message || String(event.reason), 'Promise');
        };
        window.addEventListener('unhandledrejection', handlePromiseRejection);

        return () => {
            console.error = originalConsoleError;
            window.removeEventListener('error', handleGlobalError);
            window.removeEventListener('unhandledrejection', handlePromiseRejection);
        };
    }, []);

    // Translation Logic
    const translateError = (msg) => {
        const text = String(msg);

        if (text.includes('429')) return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요. (429)';
        if (text.includes('Failed to fetch')) return '서버에 연결할 수 없습니다. 인터넷 연결을 확인하세요.';
        if (text.includes('Network Error')) return '네트워크 오류가 발생했습니다.';
        if (text.includes('Unterminated string in JSON')) return 'AI 응답 데이터 형식이 올바르지 않습니다. (JSON 오류)';
        if (text.includes('API call failed')) return 'API 호출에 실패했습니다.';
        if (text.includes('Load failed')) return '이미지나 데이터를 불러오는데 실패했습니다.';

        return text; // Return original if no translation found
    };

    if (logs.length === 0) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-40px)]'}`}>
            {/* Header / Toggle Bar */}
            <div
                className={`flex items-center justify-between px-4 py-2 cursor-pointer ${hasNewError ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-200'} border-t border-white/10`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setHasNewError(false);
                }}
            >
                <div className="flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="font-bold text-sm">
                        Debug Console ({logs.length})
                    </span>
                    {hasNewError && !isOpen && (
                        <span className="text-[10px] bg-white text-red-500 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                            NEW
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
            </div>

            {/* Log Content */}
            <div className="bg-gray-900 text-gray-300 h-64 overflow-y-auto p-4 font-mono text-xs shadow-2xl">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setLogs([]);
                        }}
                        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <Trash2 size={14} /> Clear
                    </button>
                </div>
                <div className="space-y-2">
                    {logs.map((log, index) => (
                        <div key={log.id + index} className="border-b border-gray-800 pb-2 last:border-0">
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                                <span className={`font-bold shrink-0 ${log.source === 'Global' ? 'text-red-400' : 'text-yellow-400'}`}>
                                    [{log.source}]
                                </span>
                                <div className="flex-1 break-all">
                                    <div className="text-white font-medium">{log.message}</div>
                                    {log.message !== log.originalMessage && (
                                        <div className="text-gray-500 mt-0.5 text-[10px]">
                                            Original: {log.originalMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
