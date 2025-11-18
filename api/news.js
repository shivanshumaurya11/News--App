export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY || "b6500c02fab54ee194f66dbea4d583ec";
  const query = req.query.q || "India";

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
