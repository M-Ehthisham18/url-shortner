import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Copy,
  Eye,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { useUrlStore } from "../stores/useUrlStore";

export default function AnalyticsCard({ data = null }) {
  const nav = useNavigate();
  const { urlAnalytics, isLoading } = useUrlStore();
  const { shortId } = useParams();
  const [shortUrl, setShortUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [visitCount, setVisitCount] = useState("");
  const [visitHistory, setVisityHistory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  const itemsPerPage = 10;

  const sortedVisitHistory = [...visitHistory].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const totalPages = Math.ceil(sortedVisitHistory.length / itemsPerPage);

  const currentData = sortedVisitHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUrlAnalytics = async (shortId) => {
    const res = await urlAnalytics({ shortId });
    if (res) {
      setShortUrl(
        `${
          import.meta.env.MODE === "development" ? "http://localhost:8001" : "/"
        }/${res.shortId}`
      );
      setOriginalUrl(res?.originalURl);
      setVisitCount(res?.visitedCount);
      setVisityHistory(res?.visitedHistory);
    }
  };

  const [copied, setCopied] = useState("");

  useEffect(() => {
    handleUrlAnalytics(shortId);
    const interval = setInterval(() => {
      handleUrlAnalytics(shortId);
    }, 1000 * 10);

    return () => clearInterval(interval);
  }, [shortId, urlAnalytics]);
  const handleCopy = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-28 mb-24 bg-zinc-900 text-white p-6 rounded-2xl shadow-lg space-y-6 border border-zinc-800">
      <h2 className="text-2xl font-bold text-center">🔎 URL Analytics</h2>
      <p className="text-center text-zinc-400 mb-4">
        View detailed analytics for your shortened URL, including total visits,
        original link, and visit history.
      </p>
      {/* Short ID */}
      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-xl">
        <div className="overflow-hidden">
          <p className="text-sm text-zinc-400">Short ID</p>
          <p className="truncate text-lg font-mono">{shortUrl}</p>
        </div>
        <button
          onClick={() => handleCopy(shortUrl, "shortId")}
          className="text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 cursor-pointer"
        >
          {copied === "shortId" ? "Copied!" : <Copy size={16} />}
        </button>
      </div>

      {/* Original URL */}
      <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-xl">
        <div className="overflow-hidden">
          <p className="text-sm text-zinc-400">Original URL</p>
          <p className="truncate text-lg font-mono">{originalUrl}</p>
        </div>
        <button
          onClick={() => handleCopy(originalUrl, "url")}
          className="text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 cursor-pointer"
        >
          {copied === "url" ? "Copied!" : <Copy size={16} />}
        </button>
      </div>

      {/* Visit Count */}
      <div className="border-2 border-green-500 px-4 py-2 rounded-lg">
        <p className="flex gap-2 mb-2 text-sm text-zinc-400">
          {" "}
          <Eye className="w-4" /> Total Visits
        </p>
        <div className="flex justify-between px-0.5">
          <div className="text-xl flex items-center gap-2">
            <div className="flex gap-1 items-center text-green-600 text-xs">
              <span className="mr-2 text-4xl text-white">{visitCount}</span>
              <Activity className="w-4 text-green-600 " />
              Active
            </div>
          </div>
          <TrendingUp className="text-green-500 p-2 mb-4 mr-2 w-12 h-12 rounded-full bg-green-800/40" />
        </div>
      </div>

      {/* Visit History Table */}
      <div className="overflow-x-auto">
        <p className="mb-2 text-sm text-zinc-400">Visit History</p>
        <table className="min-w-full bg-zinc-800 text-left rounded-md overflow-hidden border">
          <thead>
            <tr className="bg-zinc-700 text-sm text-zinc-300">
              <th className="py-2 px-4 ">#</th>
              <th className="py-2 px-4 pl-9.5">Date</th>
              <th className="py-2 px-4 pl-7">Time</th>
            </tr>
          </thead>
          <tbody>
            {visitHistory.length === 0 ? (
              <tr>
                <td className="py-3 px-4 text-zinc-400" colSpan={3}>
                  No visits yet.
                </td>
              </tr>
            ) : (
              currentData.map((visit, index) => {
                const date = new Date(visit.timestamp);
                return (
                  <tr
                    key={index}
                    className={`text-sm ${
                      index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"
                    }`}
                  >
                    <td className="py-2 px-4">{(index + 1)+(itemsPerPage * (currentPage - 1 ))}</td>
                    <td className="py-2 px-4">
                      {format(new Date(visit.timestamp), "dd-MM-yyyy")}
                    </td>
                    <td className="py-2 px-4">
                      {format(new Date(visit.timestamp), "hh:mm a")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* pagination  */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded cursor-pointer ${
                  currentPage === idx + 1
                    ? "bg-green-600 text-white"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 cursor-pointer bg-zinc-700 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <button
        className=" flex items-center gap-1 border border-green-500 px-4 py-1 rounded-lg bg-zinc-700 mt-12 cursor-pointer hover:bg-zinc-600"
        onClick={() => nav("/")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );
}
