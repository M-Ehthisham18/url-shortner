import { nanoid } from "nanoid";
import URL from "../models/url.model.js";

// Create a new shortened URL
const generateNewShortUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please provide a valid URL to shorten.",
      });
    }

    const existingUrl = await URL.findOne({ redirectUrl: url });
    if (existingUrl) {
      console.log(existingUrl.shortId);

      return res
        .status(200)
        .json({ id: existingUrl.shortId, message: "existing shorturl" });
    }

    const shortId = nanoid(7);

    const newUrl = await URL.create({
      shortId,
      redirectUrl: url,
      visitHistory: [],
    });

    return res.status(201).json({ id: newUrl.shortId });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while shortening the URL.",
    });
  }
};

// Handle redirection using shortId
const handleRedirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    console.log(`Redirecting for shortId: ${shortId}`);

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    if (!entry) {
      return res.status(404).json({
        error: "Not Found",
        message: "No URL found for the provided shortId.",
      });
    }

    return res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error("Error redirecting URL:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while redirecting.",
    });
  }
};

const handleCustomShortUrl = async (req, res) => {
  try {
    const {url, customId} = req.body;
    if (!url || !customId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please provide a valid URL and custom short ID.",
      });
    }
    if(customId.length < 8 ) return res.status(400).json({message: "Custom ID must be at least 8 characters long."});

    const existingCustomId = await URL.findOne({shortId : customId});
    if (existingCustomId) return res.status(400).json({message: "Custom ID already exists."});
    const preset = nanoid(3);
    const newUrl = await URL.create({
      shortId: `${preset}-${customId}`,
      redirectUrl: url,
      visitHistory: [],
    });
    return res.status(201).json({ id: newUrl.shortId, message: "Custom short URL created successfully." });
  } catch (error) {
    console.error("Error creating custom short URL:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while creating the custom short URL.",
    });
  }
};

export { generateNewShortUrl, handleRedirectUrl, handleCustomShortUrl };
