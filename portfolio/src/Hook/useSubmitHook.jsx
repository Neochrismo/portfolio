import { useState } from "react";

const useSubmit = () => {
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const submit = async (url, data) => {
    setLoading(true);
    try {
      let backendUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
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