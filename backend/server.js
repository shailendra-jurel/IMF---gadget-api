require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const gadgetRoutes = require('./routes/gadgetRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/gadgets', gadgetRoutes);

// Database connection
sequelize.sync()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke in the IMF Gadget API!');
});

module.exports = app;