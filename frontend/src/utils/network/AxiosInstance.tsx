import axios, { AxiosInstance } from "axios";
import { AxiosConfiguration } from "@/core/AxiosConfiguration";

export const axiosInstance: AxiosInstance = axios.create(AxiosConfiguration);
