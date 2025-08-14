const express = require('express');
const router = express.Router();

// Health/info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Trip Planner API',
    endpoints: {
      plan: 'POST /api/trip-planner/plan'
    }
  });
});

// Helper to call OpenAI with timeout and one retry on AbortError/network errors
async function callOpenAIWithRetry(body, timeoutMs) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const doCall = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const ct = res.headers.get('content-type') || '';
      const raw = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}\n${raw.slice(0, 400)}`);
      if (!ct.includes('application/json')) throw new Error(`Non-JSON response:\n${raw.slice(0, 400)}`);
      return JSON.parse(raw);
    } finally {
      clearTimeout(timeout);
    }
  };

  try {
    return await doCall();
  } catch (e) {
    const msg = (e && e.message) ? String(e.message) : '';
    const name = (e && e.name) ? String(e.name) : '';
    const isAbortOrNet = name === 'AbortError' || /aborted|AbortError|network|ECONN|ETIMEDOUT|timeout/i.test(msg);
    if (isAbortOrNet) {
      await new Promise(r => setTimeout(r, 2000));
      return await doCall();
    }
    throw e;
  }
}

// Plan endpoint that calls OpenAI and returns an itinerary in the expected shape
router.post('/plan', async (req, res) => {
  try {
    const { destination = 'Anywhere', startDate, endDate, days, interests = [] } = req.body || {};

    // Basic validation
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'destination, startDate and endDate are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'Server missing OPENAI_API_KEY' });
    }

    const numDays = Math.max(1, Number(days) || 1);

    // Prompt asking for strict JSON
    const prompt = `You are a travel planner. Create a detailed ${numDays}-day itinerary for a trip to ${destination}.
Trip dates are from ${startDate} to ${endDate}. Interests: ${interests.length ? interests.join(', ') : 'general'}.
Return ONLY valid JSON matching this exact schema (no markdown, no prose):
{
  "title": string,
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "activities": [
        { "time": "HH:mm", "activity": string, "location": string, "notes": string }
      ]
    }
  ]
}`;

    const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS) || 45000;

    const data = await callOpenAIWithRetry({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful travel planning assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    }, timeoutMs);

    const content = data?.choices?.[0]?.message?.content || '{}';

    let itineraryCandidate;
    try {
      itineraryCandidate = JSON.parse(content);
    } catch (e) {
      throw new Error(`Failed to parse model content as JSON:\n${String(content).slice(0, 400)}`);
    }

    // Minimal validation/coercion
    if (!itineraryCandidate || typeof itineraryCandidate !== 'object' || !Array.isArray(itineraryCandidate.days)) {
      throw new Error('Model response missing required itinerary.days array');
    }

    let itinerary = { ...itineraryCandidate };
    itinerary.days = itinerary.days.map((d, idx) => {
      const day = Number(d.day ?? idx + 1);
      const date = (d.date || startDate);
      const activities = Array.isArray(d.activities) ? d.activities : [];
      return {
        day,
        date: String(date).slice(0, 10),
        activities: activities.map(a => ({
          time: a.time || '09:00',
          activity: a.activity || 'Activity',
          location: a.location || destination,
          notes: a.notes || ''
        }))
      };
    });

    // Title fallback
    if (!itinerary.title) {
      itinerary.title = `Trip to ${destination} (${numDays} day${numDays > 1 ? 's' : ''})`;
    }

    return res.json({ success: true, itinerary });
  } catch (err) {
    const message = err && err.message ? String(err.message) : 'Unknown error';
    const name = err && err.name ? String(err.name) : '';
    const isAbort = name === 'AbortError' || /aborted|AbortError|timed out|ETIMEDOUT/i.test(message);
    if (isAbort) {
      const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS) || 45000;
      return res.status(504).json({ success: false, error: `OpenAI request timed out after ${Math.round(timeoutMs/1000)}s. Please try again.` });
    }
    console.error('Trip planner error:', message);
    return res.status(500).json({ success: false, error: 'Failed to generate itinerary', details: message.slice(0, 400) });
  }
});

module.exports = router;

module.exports = router;
