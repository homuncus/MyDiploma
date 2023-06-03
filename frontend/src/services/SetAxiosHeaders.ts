import axios from "axios"

export default function setHeaders(headers: any) {
  Object.keys(headers).forEach(key => {
    axios.defaults.headers.common[key] = headers[key]
  })
}