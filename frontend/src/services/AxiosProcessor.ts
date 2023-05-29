import { ElMessage } from 'element-plus'

/**
 * Function wrapper to process an `AxiosError` more beautifully
 * @param fn function which can throw `AxiosError` only
 * @param successCb function
 * @param errorCb 
 * @returns result of the given function
 */
export default async function process(fn: Function, successCb?: (msg: typeof ElMessage) => any, errorCb?: (msg: typeof ElMessage) => any) {
  try {
    const res = await fn();
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