
const API_KEY = undefined; // Simulating missing key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const prompt = "hello";

async function test() {
    console.log("Testing URL:", API_URL);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        console.log("Status:", response.status, response.statusText);
        const text = await response.text();
        console.log("Body:", text);

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

test();
