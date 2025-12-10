
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function generateMealInfo(menuName, language = 'ko') {
    if (!menuName) return null;

    const langInstruction = language === 'ko'
        ? 'Output MUST be in Korean.'
        : 'Output MUST be in English.';

    const prompt = `
    Role: Cooking Assistant.
    Task: Provide ingredients, recipe, and English keywords for image search for the menu "${menuName}".
    
    Output JSON ONLY:
    {
        "ingredients": ["List", "of", "ingredients"],
        "recipe": "Short step-by-step instructions.",
        "imageKeywords": "English name of the dish for image search (e.g., 'Kimchi Fried Rice')"
    }
    
    ${langInstruction}
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonStr);

        return {
            ingredients: result.ingredients || [],
            recipe: result.recipe || '',
            imageKeywords: result.imageKeywords || ''
        };
    } catch (error) {
        console.error("Failed to generate meal info:", error);
        return null;
    }
}
