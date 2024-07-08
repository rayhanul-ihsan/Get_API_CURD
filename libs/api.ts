import axios from "axios";

export const api = axios.create({
    baseURL: "https://nizom-sale-open-api.vercel.app/api"
})