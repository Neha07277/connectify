import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeTone = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const prompt = `
Rewrite the following message into 4 tones:
1. Polite
2. Professional
3. Friendly
4. Soft & Respectful

Message: "${message}"

Return ONLY a JSON array of 4 strings.
`;

    const ai = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    let raw = ai.output_text;
    let suggestions = [];

    try {
      suggestions = JSON.parse(raw);
    } catch (err) {
      console.log("JSON parse fail. Output was:", raw);
      return res.status(500).json({ error: "AI response invalid" });
    }

    return res.json({ suggestions });

  } catch (error) {
    console.error("Tone API ERROR:", error);
    res.status(500).json({ error: "Tone suggestion failed" });
  }
};
