// src/api/generate-digest.js
import { generateAIDigest } from "../services/aiService";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userName, newsletters } = req.body;

  if (!userName || !Array.isArray(newsletters)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const digest = await generateAIDigest(userName, newsletters);
    return res.status(200).json({ digest });
  } catch (error) {
    console.error("Error generating digest:", error);
    return res.status(500).json({ error: "Failed to generate digest" });
  }
}
