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
