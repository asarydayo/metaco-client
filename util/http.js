import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_URL;

axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// AUTH ONLY USAGE
// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response.status === 401) {
//       store.dispatch(auth.actions.logout());
//     }
//     return Promise.reject(error);
//   }
// );

export default axios;
