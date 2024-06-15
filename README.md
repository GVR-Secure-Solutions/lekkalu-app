# lekkalu-app

React Native App for Personal Finance Management web app UI

Since our project uses some native libraries, we need to build the app to run it in emulators.

Following files are required to build:

1.firebase/GoogleService-Info.plist
2.firebase/google-services.json

Please request these files with the admin.

Make sure you have the following things in your .env file:
`GOOGLE_SERVICES_JSON="firebase/google-services.json"`
`GOOGLE_SERVICES_PLIST="firebase/GoogleService-Info.plist"`

Then, build the app, to run in emulator using following commands.

### Cleanup

`npx expo prebuild --clean`

#p

- For ios: `npx expo run:ios`
- For android: `npx expo run:android`

## Commands for build and release

### Build

- For ios: `eas build --platform ios`
- For android: `eas build --platform android`

### Release

- For ios: `eas submit --platform ios`
- For android: `eas submit --platform android`
