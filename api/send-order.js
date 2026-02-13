export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, lang } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    if (name.length > 100 || phone.length > 20) {
      return res.status(400).json({ error: "Invalid input length" });
    }

    // Environment variables (set in Vercel Dashboard)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Missing environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const message = `🔥 NEW ORDER!

👤 Name: ${name}
📞 Phone: +998 ${phone}
⌚ Model: ZW15
💰 Price: 749 000 so'm (chegirmada)
📱 Source: Landing Page
🌐 Language: ${(lang || "uz").toUpperCase()}`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ ok: true });
    } else {
      console.error("Telegram API error:", data);
      return res.status(500).json({ error: "Failed to send message" });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
