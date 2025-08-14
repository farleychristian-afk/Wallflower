const express = require('express');
const router = express.Router();

// Minimal placeholder endpoints to keep the server healthy.
router.get('/', (req, res) => {
  res.json({
    message: 'Trip Planner API (placeholder)',
    endpoints: {
      plan: 'POST /api/trip-planner/plan'
    }
  });
});

router.post('/plan', (req, res) => {
  const { destination = 'Anywhere', days = 7 } = req.body || {};
  res.json({
    success: true,
    destination,
    days,
    itinerary: Array.from({ length: Math.max(1, Number(days) || 7) }).map((_, i) => ({
      day: i + 1,
      activities: ['Explore local sights', 'Enjoy local cuisine']
    }))
  });
});

module.exports = router;

