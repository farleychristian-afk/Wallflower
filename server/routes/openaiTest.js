const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    const userPrompt = (typeof prompt === 'string' && prompt.trim()) ? prompt.trim() : 'write a haiku about ai';

    const fetchRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.7,
      }),
    });

    const ct = fetchRes.headers.get('content-type') || '';
    const raw = await fetchRes.text();

    if (!fetchRes.ok) {
      throw new Error(`HTTP ${fetchRes.status} ${fetchRes.statusText}\n${raw.slice(0, 400)}`);
    }
    if (!ct.includes('application/json')) {
      throw new Error(`Non-JSON response:\n${raw.slice(0, 400)}`);
    }

    const data = JSON.parse(raw);

    res.json({
      success: true,
      prompt: userPrompt,
      response: data?.choices?.[0]?.message?.content || '',
      usage: data?.usage,
      model: data?.model,
    });

  } catch (error) {
    const message = error && error.message ? String(error.message) : 'Unknown error';
    console.error('OpenAI test error:', message);
    res.status(500).json({
      success: false,
      error: 'Failed to call OpenAI API',
      details: message.slice(0, 400)
    });
  }
});

module.exports = router;