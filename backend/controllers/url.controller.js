import { nanoid } from "nanoid";
import URL from "../models/url.model.js";
import axios from "axios";
import { UAParser } from "ua-parser-js";
import validUrl from "valid-url";

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

    // Validate URL format
    // new URL(url)
    if (!validUrl.isWebUri(url)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid URL format",
      });
    }

    // Check if the URL already exists
    const existingUrl = await URL.findOne({ redirectUrl: url });
    if (existingUrl) {
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
    console.log("Error creating short URL:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while shortening the URL.",
    });
  }
};

// Handle redirection using shortId
const handleRedirectUrl = async (req, res) => {
  try {
    const { shortId } = req?.params;

    if (!shortId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Short ID is required for redirection.",
      });
    }

    // find location and device
    const ip = await axios.get(process.env.DEVICE_LOCATION_API);

    // find device info
    const parser = new UAParser(req.headers["user-agent"]);
    const deviceInfo = parser.getResult();

    //pushing data info in visitHistory
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            country: ip?.data?.country_name || "Unkown",
            region: ip?.data?.region || "Unkown",
            city: ip?.data?.city || "Unkown",
            ip: ip?.data?.ip || "Unkown",
            deviceInfo: {
              os: deviceInfo?.os?.name || "Unkown",
              browser: deviceInfo?.browser?.name || "Unkown",
              deviceType: deviceInfo?.device?.type,
            },
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).json({
        error: "Not Found",
        message: "No URL found for the provided shortId.",
      });
    }

    return res.redirect(entry.redirectUrl);
  } catch (error) {
    console.log("Error redirecting URL:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while redirecting.",
    });
  }
};

const handleCustomShortUrl = async (req, res) => {
  try {
    const { url, customId } = req.body;
    if (!url || !customId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please provide a valid URL and custom short ID.",
      });
    }
    if (customId.length < 6)
      return res
        .status(400)
        .json({ message: "Custom ID must be at least 6 characters long." });

    const existingCustomId = await URL.findOne({ shortId: customId });
    if (existingCustomId)
      return res.status(400).json({ message: "Custom ID already exists." });
    const preset = nanoid(3);
    const newUrl = await URL.create({
      shortId: `${preset}-${customId}`,
      redirectUrl: url,
      visitHistory: [],
    });
    return res.status(201).json({
      id: newUrl.shortId,
      message: "Custom short URL created successfully.",
    });
  } catch (error) {
    console.log("Error creating custom short URL:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while creating the custom short URL.",
    });
  }
};

const handleUrlAnalytics = async (req, res) => {
  const { shortId } = req.params;
  try {
    const urlData = await URL.findOne({ shortId });
    if (!urlData) {
      return res.status(404).json({
        error: "Not Found",
        message: "No URL found for the provided shortId",
      });
    }
    return res.status(200).json({
      shortId: urlData?.shortId,
      originalURl: urlData?.redirectUrl,
      visitedCount: urlData?.visitHistory?.length,
      visitedHistory: urlData?.visitHistory?.map((visit) => {
        return {
          timestamp: visit?.timestamp,
          country: visit?.country,
          region: visit?.region,
          city: visit?.city,
          deviceType: visit?.deviceInfo?.deviceType,
          os: visit?.deviceInfo?.os,
          browser: visit?.deviceInfo?.browser,
          ip: visit?.ip,
        };
      }),
    });
  } catch (error) {
    console.log("Error creating custom short URL:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong while creating the custom short URL.",
    });
  }
};

export {
  generateNewShortUrl,
  handleRedirectUrl,
  handleCustomShortUrl,
  handleUrlAnalytics,
};
