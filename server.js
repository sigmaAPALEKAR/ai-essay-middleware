import express from "express";
import path from "path";
import fetch from "node-fetch"; // if Node 22+, fetch is global, optional
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// API endpoint
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "empty prompt" });
  }

  try {
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!hfResponse.ok) {
      const text = await hfResponse.text();
      return res.status(500).json({ error: "HF error", detail: text });
    }

    const json = await hfResponse.json();
    const text = json?.[0]?.generated_text ?? json?.generated_text ?? JSON.stringify(json);
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
