export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.live-rates.com/api/price?Key=demo&Symbol=XAGUSD",
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from API",
        raw: text
      });
    }

    // live-rates API returns array
    if (!json || !json[0] || !json[0].Price) {
      return res.status(500).json({
        error: "Price not found",
        data: json
      });
    }

    return res.status(200).json({
      price: Number(json[0].Price),
      source: "live-rates.com"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Fetch error",
      message: err.message
    });
  }
}
