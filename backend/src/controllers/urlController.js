const Url = require('../models/Url');
const generateCode = require('../utils/generateCode');

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

exports.createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ message: 'originalUrl required' });
  if (!isValidUrl(originalUrl)) return res.status(400).json({ message: 'Invalid URL' });

  try {
    // if same URL already exists, return it (optional)
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json({
        originalUrl: existing.originalUrl,
        shortCode: existing.shortCode,
        shortUrl: `${process.env.BASE_URL || req.get('origin')}/${existing.shortCode}`
      });
    }

    // generate unique 6-char code with retry on collision
    let code;
    let attempts = 0;
    do {
      code = generateCode();
      const collision = await Url.findOne({ shortCode: code });
      if (!collision) break;
      attempts++;
    } while (attempts < 5);

    // if still collision after attempts, append timestamp
    if (!code) code = generateCode() + Date.now().toString(36).slice(-2);

    const newUrl = new Url({
      originalUrl,
      shortCode: code
    });
    await newUrl.save();

    return res.status(201).json({
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.shortCode,
      shortUrl: `${process.env.BASE_URL || req.get('origin')}/${newUrl.shortCode}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  const { code } = req.params;
  try {
    const urlDoc = await Url.findOne({ shortCode: code }).lean();
    if (!urlDoc) return res.status(404).json({ message: 'Not found' });
    // return minimal stats
    return res.json({
      originalUrl: urlDoc.originalUrl,
      shortCode: urlDoc.shortCode,
      shortUrl: `${process.env.BASE_URL || req.get('origin')}/${urlDoc.shortCode}`,
      clicks: urlDoc.clicks,
      createdAt: urlDoc.createdAt,
      clickHistory: urlDoc.clickHistory.slice().reverse().slice(0, 20) // last 20 clicks
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
