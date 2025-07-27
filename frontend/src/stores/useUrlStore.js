import {create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../libs/axios';

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8001" : "/";

export const useUrlStore = create((set,get) => ({

  isShortUrlGenerating : false,
  isRedirecting: false,
  isQrGenerating: false,
  isCopying: false,
  isLoading: false,
    
  originalUrl :"",
  customAlias: "",
  shortenedUrl: "",
  qrUrl: "",  

  urlShortner : async (data) => {
  try {
    set({ isShortUrlGenerating : true})
    const { originalUrl, customAlias } = data;
    if (originalUrl && customAlias) {
      const res = await axiosInstance.post('/custom-url', {
        url: originalUrl,
        customId: customAlias,
      });
      toast.success("URL shortened successfully!");
      console.log(res.data);
      set({ shortenedUrl: res.data });
      return res.data;
    } else if( originalUrl){
      const res = await axiosInstance.post ('/url',{url: originalUrl});
      toast.success("URL shortened successfully!");
      console.log(res.data);
      set({ shortenedUrl: res.data});
      return res.data;
    } else {
      toast.error("Please provide a valid URL");
    }
  } catch (error) {
    console.log("Shortening failed", error);
    toast.error("URL shortening failed");
  } finally {
    set({isShortUrlGenerating : false})
  }
},

redirectUrl : async ({shortId}) => {
  try {
    log("Redirecting to shortId:", shortId);
    if (!shortId) {
      toast.error("Short ID is required for redirection");
      return;
    }
    const res = await axiosInstance.get(`/${shortId}`);
    console.log("Redirecting to:", res.data);
    window.location.href = res.data;  
    return res.data;
  } catch (error) {
    console.log("Redirection failed", error);
    toast.error("URL redirection failed");
    
  }
}
}));