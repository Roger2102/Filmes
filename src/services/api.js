import axios from "axios";

const api = axios.create({
  baseURL: "https://www.omdbapi.com/",
  params: {
    apikey: "3672ab60", // substitua pela sua chave da TMDB
  }
});

export default api;
