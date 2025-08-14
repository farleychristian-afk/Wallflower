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

    // Build prompt
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

    // Timeout using AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const fetchRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful travel planning assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' } // enforce JSON
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const ct = fetchRes.headers.get('content-type') || '';
    const raw = await fetchRes.text();

    if (!fetchRes.ok) {
      throw new Error(`HTTP ${fetchRes.status} ${fetchRes.statusText}\n${raw.slice(0, 400)}`);
    }
    if (!ct.includes('application/json')) {
      throw new Error(`Non-JSON response:\n${raw.slice(0, 400)}`);
    }

    const data = JSON.parse(raw);
    const content = data?.choices?.[0]?.message?.content || '{}';

    let itinerary;
    try {
      itinerary = JSON.parse(content);
    } catch (e) {
      throw new Error(`Failed to parse model content as JSON:\n${String(content).slice(0, 400)}`);
    }

    // Minimal validation/coercion
    if (!itinerary || typeof itinerary !== 'object' || !Array.isArray(itinerary.days)) {
      throw new Error('Model response missing required itinerary.days array');
    }

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
    console.error('Trip planner error:', message);
    return res.status(500).json({ success: false, error: 'Failed to generate itinerary', details: message.slice(0, 400) });
  }
});

module.exports = router;
