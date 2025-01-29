import axios from "axios";

let api; // Singleton API instance

const AuthAPI = () => {
  if (!api) {
    api = axios.create({
      baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  return api;
};

const getAnalytics = async (videoId) => {
  console.log("Fetching analytics...");
  const { data } = await AuthAPI().get(`/getAnalytics/${videoId}`);
  console.log("Received data:", data);
  return data;
};

export const analizeSentiment = async (videoId) => {
  const { data } = await AuthAPI().post(`/sentimentAnalysis/${videoId}`);
  console.log("sen", data);
  return data;
};

export { getAnalytics };
