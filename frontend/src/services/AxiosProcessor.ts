import { ElMessage } from 'element-plus'
import axiosStatic from 'axios';

/**
 * Function wrapper to process an `AxiosError` more beautifully
 * @param fn function which can throw `AxiosError` only
 * @param successCb function
 * @param errorCb 
 * @returns result of the given function
 */
export default async function process(fn: (axios: typeof axiosStatic, apiUrl: string) => any, successCb?: (msg: typeof ElMessage) => any, errorCb?: (msg: typeof ElMessage) => any) {
  try {
    const res = await fn(axiosStatic, String(import.meta.env.VITE_API_URL));
    if (successCb)
      successCb(ElMessage)
    return res;
  } catch (err: any) {
    if (err.response) {
      if (errorCb)
        errorCb(ElMessage)
    } else if (err.request) {
      ElMessage.error('Network error, please try again later!');
    }
  }
}