import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Rewrite the user's message in a polite, friendly, and positive tone. Respond ONLY with the improved message.",
        },
        { role: "user", content: message },
      ],
    });

    // No JSON.parse needed — it's already JSON
    const suggestion = completion.choices?.[0]?.message?.content || "No suggestion generated.";

    return res.json({ suggestion });

  } catch (error) {
    console.error("Groq error:", error);
    res.status(500).json({
      error: "Tone suggestion failed",
      details: error.message,
    });
  }
});

export default router;
