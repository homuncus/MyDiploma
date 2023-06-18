import { ElMessage } from 'element-plus'
import axios from 'axios';
import { useUserStore } from '@/stores';

/**
 * Function wrapper to process an `AxiosError` more beautifully
 * @param fn function which can throw `AxiosError` only
 * @param successCb function
 * @param userErrorCb 
 * @returns result of the given function
 */
export default async function process(fn: (axiosObj: typeof axios, apiUrl: string) => any,
  options: {
    successCb?: (msg: typeof ElMessage) => any,
    userErrorCb?: (msg: typeof ElMessage) => any,
    serverErrorCb?: (msg: typeof ElMessage) => any
  } = {}
) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
  axios.defaults.headers['Authorization'] = useUserStore().token || ''
  axios.defaults.timeout = 3000
  try {
    const res = await fn(axios, String(import.meta.env.VITE_API_URL));
    if (options.successCb)
      options.successCb(ElMessage)
    return res;
  } catch (err: any) {
    if (err.response) {
      if (options.userErrorCb)
        options.userErrorCb(ElMessage)
    } else if (err.request) {
      if (options.serverErrorCb)
        options.serverErrorCb(ElMessage)
      else {
        ElMessage({
          message: 'Network error, please try again later!',
          type: 'error',
          showClose: true,
          grouping: true
        });
      }
    }
  }
}