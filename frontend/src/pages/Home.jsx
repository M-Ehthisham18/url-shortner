import React, { use, useEffect, useState } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { useUrlStore } from "../stores/useUrlStore";
import toast from "react-hot-toast";
import {
  Copy,
  Download,
  ExternalLink,
  Link,
  Loader2Icon,
  Share2,
} from "lucide-react";
import AnalyticsCard from "./AnalyticsCard";
import { useNavigate } from "react-router-dom";

function Home() {
  const nav = useNavigate();
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isWaitingToShowUrl, setIsWaitingToShowUrl] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const { urlShortner, redirectUrl, isShortUrlGenerating } = useUrlStore();

  const handleShorten = async () => {
    if (!originalUrl) return alert("Please enter a URL");

    setShortenedUrl("");
    setQrUrl("");
    setIsWaitingToShowUrl(true); // start the 1s loading...
    
    const res = await urlShortner({ originalUrl, customAlias });
    if (!res) {
      setIsWaitingToShowUrl(false);
      return;
    }

    const shortId = `${
      import.meta.env.MODE === "development"
        ? "http://localhost:8001"
        : import.meta.env.VITE_BACKEND_URL
    }/${res.id}`;

    // Show loading for at least 1 second
    setTimeout(() => {
      setShortenedUrl(shortId);
      setIsWaitingToShowUrl(false);
    }, 1000);
    if(res.shortId){
      setOriginalUrl("");
      setCustomAlias("");
    }
  };

  const handleGenerateQR = () => {
    if (!shortenedUrl) return alert("Generate short URL first");

    setIsGeneratingQR(true); // show loading
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      shortenedUrl
    )}`;

    // Simulate delay
    setTimeout(() => {
      setQrUrl(qr);
      setIsGeneratingQR(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success("Copied!");
  };

  const openUrl = async () => {
    window.open(shortenedUrl, "_blank");
  };

  useEffect(() => {}, [isShortUrlGenerating]);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white px-4">
      <div className="bg-zinc-800 p-8 rounded-lg w-full max-w-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">URL Shortener</h1>
        <p className="text-center text-zinc-400 mb-6">
          Create short, shareable links instantly
        </p>

        {/* Input fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm">Original URL</label>
            <input
              type="url"
              placeholder="https://example.com/long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>
          <div>
            <label className="text-sm">Custom Alias (Optional)</label>
            <input
              type="text"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>
        </div>

        {/* Output URL */}
        {(shortenedUrl || isWaitingToShowUrl) && (
          <div className="mb-4">
            <label className="text-sm">Shortened URL</label>
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-1">
              {/* URL input */}
              <input
                value={shortenedUrl}
                readOnly
                className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600 mb-2 sm:mb-0 sm:flex-1"
              />

              {/* Buttons container (horizontal on sm+, vertical on <sm) */}
              <div className="flex gap-2 sm:flex-row flex-row justify-end">
                <button
                  onClick={handleCopy}
                  className="bg-zinc-600 px-3 py-2 rounded hover:bg-zinc-500 sm:w-auto cursor-pointer"
                >
                  <Copy />
                </button>
                <button
                  onClick={openUrl}
                  className="bg-zinc-600 px-3 py-2 rounded hover:bg-zinc-500 sm:w-auto cursor-pointer"
                >
                  <ExternalLink />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={handleShorten}
            className="bg-green-600 w-full py-2 rounded hover:bg-green-500 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Link className="w-5" /> Shorten URL
          </button>
          <button
            onClick={handleGenerateQR}
            disabled={!shortenedUrl}
            className="bg-zinc-700 w-full py-2 rounded hover:bg-zinc-600 disabled:opacity-50 cursor-pointer"
          >
            🧾 Generate QR Code
          </button>
        </div>

        {/* QR Code */}
        {(qrUrl || isGeneratingQR) && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">QR Code</h3>

            {isGeneratingQR ? (
              <>
                <div className="w-48 h-48 mx-auto bg-zinc-700 animate-pulse rounded flex items-center justify-center flex-col">
                  <Loader2Icon className="w-24 h-24 animate-spin mb-1" />
                  loading...
                </div>
              </>
            ) : (
              <>
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="mx-auto w-48 h-48 bg-white p-2 rounded"
                  id="qr-image"
                />
                <p className="text-sm text-zinc-400 mt-2">
                  Scan this to visit the short link
                </p>

                <div className="flex justify-center gap-4 mt-4 mb-6">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(qrUrl, { mode: "cors" });
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "qr-code.png"; // file name
                        document.body.appendChild(link); // required for Firefox
                        link.click();
                        link.remove();
                        URL.revokeObjectURL(url); // cleanup
                      } catch (err) {
                        toast.error("Failed to download QR code.");
                      }
                    }}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 flex justify-even items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-5 h-5" /> <span>Download</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(qrUrl);
                        const blob = await response.blob();
                        const file = new File([blob], "qr-code.png", {
                          type: blob.type,
                        });

                        if (
                          navigator.canShare &&
                          navigator.canShare({ files: [file] })
                        ) {
                          await navigator.share({
                            title: "QR Code",
                            text: "Scan this QR Code to open the link",
                            files: [file],
                          });
                        } else {
                          toast.error(
                            "QR sharing not supported on this device."
                          );
                        }
                      } catch (err) {
                        toast.error("Failed to share QR code.");
                      }
                    }}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 flex justify-center items-center gap-2 w-[120px] cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <div className="flex justify-end">
          <button
            disabled={!shortenedUrl}
            className="px-6 py-2 bg-blue-700/60 rounded-lg text-xl disabled:hidden hover:bg-blue-600/80 cursor-pointer"
            onClick={() => {
              if (shortenedUrl) {
                nav(`/${shortenedUrl.split("/").pop()}/analytics`);
              }
            }}
          >
            See Analytics
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Home;
