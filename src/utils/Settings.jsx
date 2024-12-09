import axios from "axios";
import { baseURL } from "./constant/settings";

export const AppSettings = {
    base_url : "https://drive.coniacloud.com/",
    DISABLE_BUTTON : "#83B2F3" 
}
export const API = axios.create({
    baseURL: baseURL,
  });