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

// Plan endpoint that returns an itinerary shape expected by the client
router.post('/plan', (req, res) => {
  try {
    const { destination = 'Anywhere', startDate, endDate, days, interests = [] } = req.body || {};

    // Basic validation
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'destination, startDate and endDate are required' });
    }

    const numDays = Math.max(1, Number(days) || 1);
    const start = new Date(startDate + 'T00:00:00');

    // Build itinerary days with simple placeholder activities
    const itineraryDays = Array.from({ length: numDays }).map((_, idx) => {
      const current = new Date(start);
      current.setDate(start.getDate() + idx);
      const isoDate = current.toISOString().slice(0, 10);

      return {
        day: idx + 1,
        date: isoDate,
        activities: [
          {
            time: '09:00',
            activity: `Explore ${destination} highlights`,
            location: destination,
            notes: interests.length ? `Focus: ${interests.join(', ')}` : 'General sightseeing'
          },
          {
            time: '13:00',
            activity: 'Local cuisine lunch',
            location: 'Recommended bistro',
            notes: 'Try popular regional dishes'
          },
          {
            time: '16:00',
            activity: 'Afternoon activity',
            location: 'City center',
            notes: 'Museums, parks, or shopping'
          }
        ]
      };
    });

    const itinerary = {
      title: `Trip to ${destination} (${numDays} day${numDays > 1 ? 's' : ''})` ,
      days: itineraryDays
    };

    return res.json({ success: true, itinerary });
  } catch (err) {
    const message = err && err.message ? String(err.message) : 'Unknown error';
    console.error('Trip planner error:', message);
    return res.status(500).json({ success: false, error: 'Failed to generate itinerary', details: message });
  }
});

module.exports = router;
