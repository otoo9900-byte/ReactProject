const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

export async function getFoodImageUrl(query) {
    if (!query) return null;

    // Check if API key is configured
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
        console.warn('Unsplash API Key is missing or invalid.');
        return null;
    }

    try {
        const response = await fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Unsplash API failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular;
        }

        return null;
    } catch (error) {
        console.error('Failed to fetch image from Unsplash:', error);
        return null;
    }
}
