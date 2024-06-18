import { ExpoConfig, ConfigContext } from 'expo/config'

module.exports = ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: config.name || '',
    slug: config.slug || '',
    android: {
      ...config.android,
      googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES_JSON,
    },
    ios: {
      ...config.ios,
      googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES_PLIST,
    },
  }
}
