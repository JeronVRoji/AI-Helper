export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            role: "system",
            parts: [
              {
                text: "You are a helpful AI study assistant. Always reply clearly and completely."
              }
            ]
          },

          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],

          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 512
          },

          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUAL_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("GEMINI RAW:", JSON.stringify(data));

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join("") ||
      "Gemini returned no text.";

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
