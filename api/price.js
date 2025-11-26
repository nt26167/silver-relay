export default async function handler(req, res) {
  try {
    const url = "https://api.live-rates.com/api/price?Key=demo&Symbol=XAGUSD";

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON",
        raw: text
      });
    }

    if (!json || !json.Price) {
      return res.status(500).json({
        error: "No valid price",
        data: json
      });
    }

    return res.status(200).json({ price: json.Price });

  } catch (err) {
    return res.status(500).json({
      error: "FETCH ERROR",
      message: err.message
    });
  }
}
