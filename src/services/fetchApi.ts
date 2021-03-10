import notification from "../utils/notification";
import retry from "../utils/retry";

type Method = "GET" | "POST" | "DELETE";

const fetchApi = async (
  url: string,
  method: Method = "GET",
  data?: Record<string, unknown>
) => {
  try {
    const options: RequestInit = {
      method,
      headers: data
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await retry(() => fetch(url, options));
    return await response.json();
  } catch (error) {
    let _error = error;
    if (typeof error.json === "function") {
      _error = await error.json();
    }
    console.error(error);
    console.error(_error);
    notification("Error", _error.error, "error");
  }
};

export default fetchApi;
