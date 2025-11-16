import fetch from "node-fetch";

export async function handler(event) {
    const API_KEY = "b6500c02fab54ee194f66dbea4d583ec"; // your real key
    const query = event.queryStringParameters.q || "India";

    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch news" }),
        };
    }
}
