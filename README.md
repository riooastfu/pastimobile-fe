# PastiMobile

This is a React Native project with Firebase integration and camera functionality, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Features

- Firebase Authentication & Messaging
- Camera functionality with react-native-vision-camera
- Location services
- Push notifications

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Prerequisites

- Node.js >= 16
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- Firebase project setup

## Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and Cloud Messaging

### 2. Android Setup
1. Add Android app to Firebase project
2. Download `google-services.json`
3. Place it in `android/app/google-services.json`
4. The project is already configured with:
   - Firebase BOM version: 34.1.0
   - Compile/Target SDK: 35
   - Min SDK: 26

### 3. iOS Setup
1. Add iOS app to Firebase project
2. Download `GoogleService-Info.plist`
3. Add to iOS project in Xcode
4. Run `cd ios && pod install`

## React Native Vision Camera Setup

### Permissions
The following permissions are already configured:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

**iOS** (`ios/YourApp/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access to record videos</string>
```

### Configuration
- Frame Processors: **Enabled**
- Code Scanner: **Disabled**
- Worklets Core: **Enabled**

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Configuration Files

## Android Resources
The following resources are configured for Firebase notifications:

- `android/app/src/main/res/values/colors.xml` - Notification color
- `android/app/src/main/res/drawable/ic_notification.xml` - Notification icon

## Permissions
- Internet access
- Camera access
- Audio recording
- Location services (fine and coarse)

# Troubleshooting

## Common Issues

### Firebase Build Errors
- Ensure `google-services.json` is in `android/app/`
- Check Firebase project configuration
- Verify package name matches Firebase app

### Camera Permission Issues
- Request permissions at runtime
- Check device camera availability
- Ensure proper permission declarations

### Android Build Issues
- Clean build: `cd android && ./gradlew clean`
- Check Android SDK Build Tools version
- Verify compileSdk and targetSdk versions

If you're having other issues, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Dependencies

## Main Libraries
- `@react-native-firebase/app` - Firebase core
- `@react-native-firebase/messaging` - Push notifications
- `react-native-vision-camera` - Camera functionality
- `react-native-worklets-core` - Frame processors

# Learn More

## React Native Resources
- [React Native Website](https://reactnative.dev)
- [Getting Started](https://reactnative.dev/docs/environment-setup)
- [Learn the Basics](https://reactnative.dev/docs/getting-started)

## Firebase Resources
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Documentation](https://firebase.google.com/docs)

## Camera Resources
- [React Native Vision Camera](https://react-native-vision-camera.com/)
- [Frame Processors](https://react-native-vision-camera.com/docs/guides/frame-processors)
