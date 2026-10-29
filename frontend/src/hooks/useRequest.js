import { useCallback, useState } from "react";
import axios from "axios";

const getCookie = (name) => {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();

      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

        break;
      }
    }
  }

  return cookieValue;
};

export const useRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (method, url, data = {}, headers = {}, config = { BASE_URL: "" }) => {
      try {
        setIsLoading(true);
        setError(null);

        const csrfToken = getCookie("csrftoken");

        const res = await axios({
          method,
          url: `${config.BASE_URL}${url}/`,
          ...(method.toLowerCase() === "get" ? { params: data } : { data }),
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            ...headers,
          },
        });

        return res;
      } catch (err) {
        console.dir(err);

        const errorMessage =
          err.response?.data?.Error ||
          err.response?.data?.error ||
          err.response?.statusText ||
          "Something went wrong";

        setError(errorMessage);

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    request,
    isLoading,
    error,
  };
};
