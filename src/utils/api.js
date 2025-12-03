
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function generateIngredients(menuName, language = 'ko') {
    if (!menuName) return [];

    const langInstruction = language === 'ko'
        ? 'Output MUST be in Korean.'
        : 'Output MUST be in English.';

    const prompt = `
    You are a helpful cooking assistant.
    The user will provide a menu name.
    You must list the main ingredients required to cook this menu.
    Return ONLY a JSON object with a single key "ingredients" which is an array of strings.
    Do not include any markdown formatting or explanations.
    ${langInstruction}
    Example input: "Kimchi Stew"
    Example output: { "ingredients": ["Kimchi", "Pork", "Tofu", "Green Onion", "Onion"] }
    
    Input: "${menuName}"
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
                }]
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

        return result.ingredients || [];
    } catch (error) {
        console.error("Failed to generate ingredients:", error);
        return [];
    }
}
