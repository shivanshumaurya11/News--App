// netlify/functions/news.js

export async function handler(event) {
  const API_KEY = process.env.NEWS_API_KEY || "b6500c02fab54ee194f66dbea4d583ec";
  const query = (event.queryStringParameters && event.queryStringParameters.q) || "India";

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
