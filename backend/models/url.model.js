import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  os: { type: String, default: "Unkown" },
  browser: { type: String, default: "Ukown" },
  deviceType: { type: String, default: "Desktop" },
});

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        country: { type: String, default: "Unkown" },
        region: { type: String, default: "Unkown" },
        city: { type: String, default: "Unkown" },
        ip: { type: String, default: "Unkown" },
        deviceInfo: deviceSchema, // Store device information
      },
    ],
  },
  {
    timestamps: true,
  }
);

const URL = mongoose.model("URL", urlSchema);

export default URL;
