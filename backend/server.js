const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/cafes', require('./src/routes/cafes'));
app.use('/api/upload', require('./src/routes/upload'));
app.use('/api/discover', require('./src/routes/discover'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'CafeQuest API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
