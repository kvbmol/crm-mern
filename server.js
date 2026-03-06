require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database.js');

const app = express();  

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/customers', require('./routes/customerRoutes'));
app.use('/', require('./routes'));


app.get('/', (req, res) => {
  res.json({ message: 'CRM Backend Running!' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CRM Backend running on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB connection failed:', err.message);
  process.exit(1);
});