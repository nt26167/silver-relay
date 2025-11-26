export default {
  async fetch(request) {
    try {
      const res = await fetch("https://api.live-rates.com/api/price?Key=demo&Symbol=XAGUSD", {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const text = await res.text();
      let json;

      try {
        json = JSON.parse(text);
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON from source", raw: text }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      if (!json || !json.Price) {
        return new Response(JSON.stringify({ error: "No valid price", data: json }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        symbol: json.Symbol,
        bid: Number(json.Bid),
        ask: Number(json.Ask),
        price: Number(json.Price),
        source: "XM"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Fetch failed", detail: err + "" }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
