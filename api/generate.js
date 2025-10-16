export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || prompt.trim().length === 0) {
      res.status(400).json({ error: 'empty prompt' });
      return;
    }

    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!hfResponse.ok) {
      const text = await hfResponse.text();
      res.status(500).json({ error: 'HF error', detail: text });
      return;
    }

    const json = await hfResponse.json();
    const text = json?.[0]?.generated_text ?? (json?.generated_text) ?? JSON.stringify(json);
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
