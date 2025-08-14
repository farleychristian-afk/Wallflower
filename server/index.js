require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const tripPlannerRoutes = require('./routes/tripPlanner');
const openaiTestRoutes = require('./routes/openaiTest');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// Also accept URL-encoded bodies (e.g., form posts)
app.use(express.urlencoded({ extended: true }));

// Fallback: accept text bodies and parse JSON if it looks like JSON
app.use(express.text({ type: '*/*' }));
app.use((req, _res, next) => {
  if (typeof req.body === 'string') {
    const s = req.body.trim();
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        req.body = JSON.parse(s);
      } catch (_err) {
        // leave as text if not parseable
      }
    }
  }
  next();
});


// Routes
app.use('/api/trip-planner', tripPlannerRoutes);
app.use('/api/openai-test', openaiTestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
