
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function generateMealInfo(menuName, language = 'ko') {
    if (!API_KEY) {
        console.error("Error: VITE_GEMINI_API_KEY is missing. Please check your .env file.");
        return null;
    }

    if (!menuName) return null;

    const langInstruction = language === 'ko'
        ? 'Output MUST be in Korean.'
        : 'Output MUST be in English.';

    const prompt = `
    Role: Cooking Assistant.
    Task: Provide ingredients, recipe, and English keywords for image search for the menu "${menuName}".
    
    Input JSON ONLY:
    {
        "ingredients": ["List", "of", "ingredients"],
        "recipe": "Short step-by-step instructions.",
        "imageKeywords": "English name of the dish for image search (e.g., 'Kimchi Fried Rice')",
        "nutrition": {
            "calories": "e.g., 500kcal",
            "carbs": "e.g., 60g",
            "protein": "e.g., 20g",
            "fat": "e.g., 15g"
        }
    }
    
    ${langInstruction}
    IMPORTANT: List ingredients in the requested language ONLY. Do NOT include translations in parentheses (e.g., use '오이', NOT '오이(Cucumber)').
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
                    maxOutputTokens: 5000,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // Clean up and extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in response:", text);
            throw new Error("Invalid API response format");
        }

        const jsonStr = jsonMatch[0];
        let result;
        try {
            result = JSON.parse(jsonStr);
        } catch (parseError) {
            // Fallback: try to clean up undefined newlines in strings if that's the issue
            console.error("JSON Parse failed, attempting cleanup. Raw:", jsonStr);
            try {
                // Remove potential trailing commas or fix common issues if needed
                // For now, re-throw but log the specific content
                throw parseError;
            } catch (e) {
                throw new Error(`JSON Parsing Error: ${e.message}`);
            }
        }

        return {
            ingredients: result.ingredients || [],
            recipe: result.recipe || '',
            imageKeywords: result.imageKeywords || '',
            nutrition: result.nutrition || null
        };
    } catch (error) {
        console.error("Failed to generate meal info:", error);
        return null;
    }
}

export async function normalizeIngredients(ingredients) {
    if (!ingredients || ingredients.length === 0) return [];

    const prompt = `
    Task: Normalize and categorize this list of grocery items. Combine duplicates and fix typos.
    Input: ${ingredients.join(', ')}

    Output JSON ONLY:
    {
        "normalized": ["List", "of", "clean", "ingredient", "names"]
    }
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3 }
            })
        });

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return result.normalized || ingredients;
        }
        return ingredients;
    } catch (error) {
        console.error("Failed to normalize ingredients:", error);
        return ingredients; // Fallback to original list
    }
}
