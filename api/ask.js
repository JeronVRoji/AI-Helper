export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await geminiRes.json();

    // 🔍 DEBUG (remove later if you want)
    console.log("RAW GEMINI RESPONSE:", JSON.stringify(data));

    let reply = "";

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content?.parts?.length > 0
    ) {
      reply = data.candidates[0].content.parts
        .map(p => p.text)
        .join("");
    } else if (data.promptFeedback) {
      reply = "⚠️ Gemini blocked or filtered this request.";
    } else {
      reply = "⚠️ Gemini returned an empty response.";
    }

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
