require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoutes = require('./src/routes/url');

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/api/url', urlRoutes);

// Redirect route must be last - handles GET /:code
const Url = require('./src/models/Url');
app.get('/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const urlDoc = await Url.findOne({ shortCode: code });
    if (!urlDoc) return res.status(404).json({ message: 'Short URL not found' });

    // increment clicks & add click record
    urlDoc.clicks += 1;
    urlDoc.clickHistory.push({
      timestamp: new Date(),
      referrer: req.get('Referrer') || 'direct',
      userAgent: req.get('User-Agent') || 'unknown'
    });
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Mongo connect error:', err));
