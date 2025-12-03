
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function generateMealInfo(menuName, language = 'ko') {
    if (!menuName) return null;

    const langInstruction = language === 'ko'
        ? 'Output MUST be in Korean.'
        : 'Output MUST be in English.';

    const prompt = `
    You are a helpful cooking assistant.
    The user will provide a menu name.
    You must provide:
    1. The main ingredients required to cook this menu.
    2. A short, step-by-step recipe (cooking instructions).

    Return ONLY a JSON object with two keys:
    - "ingredients": an array of strings.
    - "recipe": a string containing the cooking instructions (use \\n for line breaks).

    Do not include any markdown formatting or explanations.
    ${langInstruction}
    
    Example input: "Kimchi Stew"
    Example output: { 
        "ingredients": ["Kimchi", "Pork", "Tofu", "Green Onion", "Onion"],
        "recipe": "1. Stir-fry pork and kimchi.\\n2. Add water and boil.\\n3. Add tofu and onions."
    }
    
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

        return {
            ingredients: result.ingredients || [],
            recipe: result.recipe || ''
        };
    } catch (error) {
        console.error("Failed to generate meal info:", error);
        return null;
    }
}
