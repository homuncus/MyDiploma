import axios from "axios";

/**
 * @function check - checks if the specified item exists using the `api/resourcePath/findBy/:attr` http request
 * @param resourcePath The path to the resource in `camelCase` ('users', 'teaCups' etc.)
 * @param attributeName Name of the attribute to search by
 */
export async function itemExists(resourcePath: string, attributeName: string, value: any, validationCb?: Function) {
  const res = resourcePath.replace(/([A-Z])/g, " $1");
  const resourceName = res.charAt(0).toUpperCase() + res.slice(1, res.length - 1);
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/${resourcePath}/findBy/${attributeName}?value=${value}`)
    if (validationCb) return validationCb(new Error(`${resourceName} with such ${attributeName} already exists`))
    return true
  } catch (err: any) {
    if (err.response) {
      if (validationCb) return validationCb()

    } else if (err.request) {
      if (validationCb) return validationCb(new Error('Server validation error, please try later'))
      throw new Error('NETWORK_ERR')
    }
  }
}

export async function itemExistsExcept(resourcePath: string, attributeName: string, value: any, except: any, validationCb?: Function) {
  const res = resourcePath.replace(/([A-Z])/g, " $1");
  const resourceName = res.charAt(0).toUpperCase() + res.slice(1, res.length - 1);
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/${resourcePath}/findBy/${attributeName}?value=${value}`)
    if (validationCb && data[value] !== except) return validationCb(new Error(`${resourceName} with such ${attributeName} already exists`))
    return true
  } catch (err: any) {
    if (err.response) {
      if (validationCb) return validationCb()
      return false
    } else if (err.request) {
      if (validationCb) return validationCb(new Error('Server validation error, please try later'))
      throw new Error('NETWORK_ERR')
    }
  }
}