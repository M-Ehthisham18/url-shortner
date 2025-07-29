import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../libs/axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8001"
    : import.meta.env.VITE_BACKEND_URL;

export const useUrlStore = create((set, get) => ({
  isShortUrlGenerating: false,
  isRedirecting: false,
  isQrGenerating: false,
  isCopying: false,
  isLoading: false,

  originalUrl: "",
  customAlias: "",
  shortenedUrl: "",
  qrUrl: "",

  urlShortner: async (data) => {
    set({ isLoading: true });
    try {
      set({ isShortUrlGenerating: true });
      const { originalUrl, customAlias } = data;
      if (originalUrl && customAlias) {
        const res = await axiosInstance.post("/custom-url", {
          url: originalUrl,
          customId: customAlias,
        });
        toast.success(res?.data?.message ||"URL shortened successfully!");
        set({ shortenedUrl: res.data });
        return res.data;
      } else if (originalUrl) {

        const res = await axiosInstance.post("/url", { url: originalUrl });
        toast.success(res?.data?.message ||"URL shortened successfully!");
        set({ shortenedUrl: res.data });
        return res.data;
      } else {
        toast.error("Please provide a valid URL");
      }
    } catch (error) {
      console.log("Shortening failed", error);
      toast.error("URL shortening failed");
    } finally {
      set({ isLoading: false });
      set({ isShortUrlGenerating: false });
    }
  },

  redirectUrl: async ({ shortId }) => {
    try {
      if (!shortId) {
        toast.error("Short ID is required for redirection");
        return;
      }
      const res = await axiosInstance.get(`/${shortId}`);
      window.location.href = res.data;
      return res.data;
    } catch (error) {
      console.log("Redirection failed", error);
      toast.error("URL redirection failed");
    }
  },
  urlAnalytics: async ({ shortId }) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/${shortId}/analytics`);
      if (!res.data) return;
      return res.data;
    } catch (error) {
      console.log("Fetching analytics failed", error);
      toast.error("Failed to fetch URL analytics");
    } finally {
      set({ isLoading: false });
    }
  },
}));
