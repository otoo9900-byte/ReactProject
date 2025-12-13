export const THEMES = {
    default: {
        name: 'Pastel Dream',
        colors: {
            '--bg-gradient-start': '#e0c3fc',
            '--bg-gradient-end': '#8ec5fc',
            '--text-primary': '#4a5568',
            '--text-secondary': '#718096',
            '--glass-bg': 'rgba(255, 255, 255, 0.25)',
            '--glass-border': 'rgba(255, 255, 255, 0.3)',
            '--card-bg': 'rgba(255, 255, 255, 0.4)',
            '--card-bg-hover': 'rgba(255, 255, 255, 0.6)',
            '--accent-color': '#3b82f6', // blue-500
            '--accent-hover': '#2563eb', // blue-600
            '--sidebar-bg': 'rgba(255, 255, 255, 0.25)',
        }
    },
    dark: {
        name: 'Neon Nights',
        colors: {
            '--bg-gradient-start': '#020617', // slate-950 (darker background)
            '--bg-gradient-end': '#0f172a',   // slate-900
            '--text-primary': '#ffffff',      // Pure white for max contrast
            '--text-secondary': '#e2e8f0',    // slate-200 (lighter)
            '--glass-bg': 'rgba(15, 23, 42, 0.85)', // More opaque
            '--glass-border': 'rgba(255, 255, 255, 0.2)', // Stronger border
            '--card-bg': 'rgba(30, 41, 59, 0.9)', // Almost solid for better readability
            '--card-bg-hover': 'rgba(51, 65, 85, 0.95)',
            '--accent-color': '#a78bfa',      // violet-400 (brighter accent)
            '--accent-hover': '#8b5cf6',      // violet-500
            '--sidebar-bg': 'rgba(15, 23, 42, 0.9)',
        }
    },
    nature: {
        name: 'Forest Whisper',
        colors: {
            '--bg-gradient-start': '#d9f99d', // lime-200
            '--bg-gradient-end': '#86efac',   // green-300
            '--text-primary': '#14532d',      // green-900
            '--text-secondary': '#166534',    // green-800
            '--glass-bg': 'rgba(255, 255, 255, 0.4)',
            '--glass-border': 'rgba(255, 255, 255, 0.4)',
            '--card-bg': 'rgba(240, 253, 244, 0.6)',
            '--card-bg-hover': 'rgba(220, 252, 231, 0.8)',
            '--accent-color': '#15803d',      // green-700
            '--accent-hover': '#166534',      // green-800
            '--sidebar-bg': 'rgba(255, 255, 255, 0.3)',
        }
    },
    monochrome: {
        name: 'Modern Mono',
        colors: {
            '--bg-gradient-start': '#e5e5e5',
            '--bg-gradient-end': '#ffffff',
            '--text-primary': '#171717',      // neutral-900
            '--text-secondary': '#404040',    // neutral-700
            '--glass-bg': 'rgba(255, 255, 255, 0.9)',
            '--glass-border': 'rgba(0, 0, 0, 0.1)',
            '--card-bg': 'rgba(255, 255, 255, 0.8)',
            '--card-bg-hover': 'rgba(255, 255, 255, 1)',
            '--accent-color': '#171717',      // neutral-900
            '--accent-hover': '#000000',
            '--sidebar-bg': 'rgba(255, 255, 255, 0.9)',
        }
    }
};
