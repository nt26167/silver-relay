export default async function handler(req, res) {
  try {
    // ฟรี ไม่ต้องใช้ API key
    const response = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NT-silver-bot/1.0)"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "UPSTREAM_ERROR",
        status: response.status,
        body: text.slice(0, 200)
      });
    }

    const json = await response.json();
    const items = json.items || [];
    const usd = items.find((it) => it.curr === "USD") || items[0];

    const price = usd && !Number.isNaN(Number(usd.xagPrice))
      ? Number(usd.xagPrice)
      : null;

    if (!price) {
      return res.status(500).json({
        error: "NO_XAG_PRICE",
        data: usd
      });
    }

    return res.status(200).json({
      symbol: "XAGUSD",
      price,                     // ราคา Silver/oz (USD)
      source: "data-asg.goldprice.org",
      date: json.date,
      ts: json.ts
    });
  } catch (err) {
    return res.status(500).json({
      error: "FETCH_ERROR",
      message: String(err)
    });
  }
}
