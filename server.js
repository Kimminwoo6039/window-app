const express = require('express');
const apiRoutes = require('./routes/api');
const cors = require('cors');
const app = express();

// Middleware for JSON request body parsing
app.use(express.json());
app.use(cors());
// Use API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
