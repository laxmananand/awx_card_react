import Axios from "axios";

// Create an Axios instance
const axiosInstance = Axios.create({});

// Function to set up interceptors dynamically
export const setupAxiosInterceptors = (getState) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const xApiKey = getState().utility?.headers?.xApiKey; // Get x-api-key from Redux store
      const xClientId = getState().utility?.headers?.xClientId; // Get x-api-key from Redux store
      const xProgramId = getState().utility?.headers?.xProgramId; // Get x-api-key from Redux store
      const xClientName = getState().utility?.headers?.xClientName; // Get x-api-key from Redux store
      const xUserId = getState().auth?.user?.userId; // Get userId from Redux store
      console.log("print", getState().auth?.user);

      config.params = config.params || {};
      config.headers = config.headers || {};

      if (xApiKey && xClientId && xProgramId && xClientName) {
        config.headers["x-api-key"] = xApiKey; // Attach x-api-key in headers
        config.headers["x-client-id"] = xClientId; // Attach x-api-key in headers
        config.headers["x-program-id"] = xProgramId; // Attach x-api-key in headers
        config.headers["x-client-name"] = xClientName; // Attach x-api-key in headers
        config.headers["x-user-id"] = xUserId;
        config.headers["x-product-id"] = "SAVAAM0";
        config.headers["x-request-id"] = "5b9a3696-85e9-4e52-96b3-12276dff9335";
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
