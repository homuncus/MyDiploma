import { ElMessage } from 'element-plus'
import axios from 'axios';
import { useUserStore } from '@/stores';

/**
 * Function wrapper to process an `AxiosError` more beautifully
 * @param fn function which can throw `AxiosError` only
 * @param successCb function
 * @param errorCb 
 * @returns result of the given function
 */
export default async function process(fn: (axiosObj: typeof axios, apiUrl: string) => any, successCb?: (msg: typeof ElMessage) => any, errorCb?: (msg: typeof ElMessage) => any) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
  axios.defaults.headers['Authorization'] = useUserStore().token || ''
  try {
    const res = await fn(axios, String(import.meta.env.VITE_API_URL));
    if (successCb)
      successCb(ElMessage)
    return res;
  } catch (err: any) {
    if (err.response) {
      if (errorCb)
        errorCb(ElMessage)
    } else if (err.request) {
      ElMessage({
        message: 'Network error, please try again later!',
        type: 'error',
        showClose: true,
        grouping: true
      });
    }
  }
}