require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Root endpoint for /v1
app.get('/v1', (req, res) => {
  res.json({
    message: "Welcome to Blogify API v1",
    endpoints: [
      "/v1/auth/register",
      "/v1/auth/login",
      "/v1/users",
      "/v1/users/me",
      "/v1/posts",
      "/v1/health",
      "/v1/docs"
    ]
  });
});

// Health check
app.get('/v1/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/posts', postRoutes);

// Swagger docs
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: { message: err.message || 'Internal Server Error' } });
});

// Start server
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogify';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error', err);
    process.exit(1);
  });

