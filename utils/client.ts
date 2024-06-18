import axios, { AxiosHeaders } from 'axios'
import { getToken } from './token'

const BASIC_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const BASE_URL = 'https://api1.finuncle.com'

/**
 * This is general api client which will be used for most of the stuff
 */
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: BASIC_HEADER,
})

apiClient.interceptors.request.use(async (config) => {
  config.headers = new AxiosHeaders(config.headers)
  const accessToken = await getToken('access')
  if (accessToken) {
    config.headers.setAuthorization(`Bearer ${accessToken}`)
  }
  return config
})

export const apiv2Client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_V2_BASE_URL,
  headers: BASIC_HEADER,
})

apiv2Client.interceptors.request.use(async (config) => {
  config.headers = new AxiosHeaders(config.headers)
  const accessToken = await getToken('access')
  if (accessToken) {
    config.headers.setAuthorization(`Bearer ${accessToken}`)
  }
  return config
})

/**
 * This is for user specific requests
 */
export const userClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_USER_BASE_URL,
  headers: BASIC_HEADER,
})

userClient.interceptors.request.use(async (config) => {
  config.headers = new AxiosHeaders(config.headers)
  const accessToken = await getToken('access')
  if (accessToken) {
    config.headers.setAuthorization(`Bearer ${accessToken}`)
  }
  return config
})

export const socialLoginClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_USER_BASE_URL_WO_API_KEYWORD,
  headers: BASIC_HEADER,
})

/**
 * This is for token specific requests
 */
export const tokenClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_TOKEN_BASE_URL,
  headers: BASIC_HEADER,
})
