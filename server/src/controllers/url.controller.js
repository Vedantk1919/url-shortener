const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const auth = require("../middleware/auth");
const { URLModel } = require("../models/url.model");
const { generateShortId } = require("../utils");
const QRCode = require('qrcode');

const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.BASEURI
    : 'http://localhost:5000';

//generaton of shortID
const generateUniqueShortId = async () => {
    let shortId;
    let existingURL;

    while (true) {
        shortId = generateShortId();
        existingURL = await URLModel.findOne({ urlCode: shortId });

        if (!existingURL) {
            break;
        }
    }
    return shortId;
};

//generation of QR
const generateQR = async (url) => {
    try {
        return await QRCode.toDataURL(url);
    } catch (err) {
        console.error('Error generating QR code:', err);
        return null;
    }
};

router.post("/shorten", auth, async (req, res) => {
    const { longUrl, urlCode } = req.body;

    try {
        if (!validUrl.isUri(longUrl)) {
            return res.status(401).json({ error: "Invalid Url" });
        }

        if (urlCode) {
            const existingCodeBookmark = await URLModel.findOne({ urlCode });
            if (existingCodeBookmark) {
                return res.status(400).json({ error: `Code ${urlCode} already in use. Please choose a different code.` });
            }
        }

        const existingURL = await URLModel.findOne({ longUrl, userId: req.user.userId });

        if (existingURL && !urlCode) {
            return res.json({
                urlCode: existingURL.urlCode,
                shortUrl: existingURL.shortUrl,
                qrCode: existingURL.qrCode
            });
        }

        let generatedCode;
        if (!urlCode) {
            generatedCode = await generateUniqueShortId();
        } else {
            generatedCode = urlCode;
        }

        const shortUrl = `${baseUrl}/${generatedCode}`;
        const qrCode = await generateQR(shortUrl);

        const newURL = new URLModel({
            urlCode: generatedCode,
            longUrl,
            shortUrl,
            userId: req.user.userId,
            qrCode: qrCode
        });

        await newURL.save();
        res.status(201).json({
            urlCode: generatedCode,
            shortUrl: shortUrl,
            qrCode: qrCode
        });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ error: 'Failed to shorten URL' });
    }
});


router.get("/my-urls", auth, async (req, res) => {
    try {
        const urls = await URLModel.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(urls);
    } catch (error) {
        console.error('Error fetching URLs:', error);
        res.status(500).json({ error: 'Failed to fetch URLs' });
    }
});

module.exports = router;