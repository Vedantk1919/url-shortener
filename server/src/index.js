const express = require('express');
const redirect = require('./controllers/redirects.controller');
const url = require('./controllers/url.controller');
const authRoutes = require('./routes/auth'); 
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:3000', 
      'https://shorten-url-vcit.onrender.com', 
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.get('/', (req, res) => {
  res.status(200).json({ Message: 'Hi there' });
});

app.use('/', redirect);
app.use('/api/url', url);
app.use('/api/auth', authRoutes);

module.exports = app;
