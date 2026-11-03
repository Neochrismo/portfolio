import { useState } from "react";

const useSubmit = () => {
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const submit = async (url, data) => {
    setLoading(true);
    try {
      // Smart URL resolution: 
      // If 'url' passed from the component is already a full URL, use it.
      // Otherwise, combine VITE_API_URL (or localhost fallback) with the relative path.
      let backendUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        // Ensure clean slashes so we don't get double slashes like //contact
        const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        backendUrl = `${cleanBase}${cleanPath}`;
      }

      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataJson = await res.json();

      if (!res.ok) {
        throw new Error(dataJson.message || "Submission failed");
      }

      setResponse(dataJson);
    } catch (err) {
      setResponse({
        type: "error",
        message: err.message || "Something went wrong, please try again later!",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResponse = () => setResponse(null);

  return { isLoading, response, submit, clearResponse };
};

export default useSubmit;