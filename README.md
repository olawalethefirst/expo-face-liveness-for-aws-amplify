# expo-face-liveness-for-aws-amplify

Expo module wrapper for AWS Amplify Face Liveness on iOS and Android.

## Compatibility

Tested with:

| Area | Version |
| --- | --- |
| Expo SDK | 54, 55 |
| Kotlin / Compose compiler plugin | 2.1.20 |
| Android AWS Amplify UI Liveness | 1.10.0 |
| Android Compose BOM | 2025.10.00 |
| iOS deployment target | 15.1 |
| Swift | 5.9 |

Other versions may work, but they are not part of the tested release matrix.

## Platform Support

| Platform | Status |
| --- | --- |
| iOS | Supported |
| Android | Supported |
| Web | Not supported |
| Expo Go | Not supported |
| Custom development client / EAS build | Supported |

## Installation

```bash
npm install expo-face-liveness-for-aws-amplify
```

Add the config plugin and rebuild native projects:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-face-liveness-for-aws-amplify",
        {
          "cameraPermission": "Allow this app to use the camera for face liveness verification."
        }
      ]
    ]
  }
}
```

```bash
npx expo prebuild --clean
```

This package includes native iOS and Android code. Use a custom development client or an EAS/native build after installing or changing the config plugin.

## Usage

Create a Face Liveness session and temporary AWS credentials on your backend. Then set those credentials before rendering the detector view.

```tsx
import {
  FaceLivenessDetectorView,
  setAuthCredentials,
  type AuthCredentials,
} from 'expo-face-liveness-for-aws-amplify';

type SessionResponse = {
  sessionId: string;
  region: string;
  credentials: AuthCredentials;
};

const data = (await response.json()) as SessionResponse;

await setAuthCredentials(data.credentials);

<FaceLivenessDetectorView
  sessionId={data.sessionId}
  region={data.region}
  disableStartView
  onAnalysisComplete={(event) => {
    console.log(event.nativeEvent.sessionId);
  }}
  onError={(event) => {
    console.log(event.nativeEvent);
  }}
/>;
```

The expected app flow is:

1. Your backend creates a Face Liveness session.
2. Your backend returns the `sessionId`, AWS `region`, and temporary scoped credentials.
3. The app calls `setAuthCredentials(credentials)`.
4. The app renders `FaceLivenessDetectorView`.
5. The app handles `onAnalysisComplete`.
6. Your backend checks the final Face Liveness result.

Do not ship long-lived AWS credentials in the app bundle.

## API

### `setAuthCredentials(credentials)`

Configures the temporary AWS auth credentials used by the native AWS credentials provider.

### `clearAuthCredentials()`

Clears the stored temporary AWS auth credentials.

### `FaceLivenessDetectorView`

Props:

- `sessionId: string`
- `region: string`
- `disableStartView?: boolean`
- `challengeOptions?: { faceMovement?: { camera?: 'front' | 'back' } }`
- `onAnalysisComplete?: (event) => void`
- `onError?: (event) => void`

`onAnalysisComplete` receives:

- `sessionId: string`

`onError` receives:

- `code?: string | number`
- `message: string`
- `sessionId?: string`
- `recoverySuggestion?: string`

## Config Plugin Options

- `cameraPermission?: string`
- `composePluginVersion?: string` advanced Android override for the Kotlin Compose compiler plugin version. Defaults to the version tested with this package.

The plugin adds camera permissions, Android desugaring, and the Kotlin Compose compiler plugin required by the Android AWS Amplify UI dependency.

The config plugin updates native project configuration by:

- Adding `android.permission.CAMERA`.
- Setting `NSCameraUsageDescription`.
- Enabling Android core library desugaring.
- Adding the Android desugaring dependency.
- Adding Compose compiler plugin resolution when the consuming app has not already configured it.

Only change `composePluginVersion` when your Expo/Kotlin toolchain requires a different Compose compiler plugin version.

## Backend Contract

This module expects the consuming app to provide a backend endpoint that creates the Face Liveness session and returns temporary credentials.

Example response shape:

```ts
type SessionResponse = {
  sessionId: string;
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
  };
};
```

The backend should scope credentials to the minimum permissions needed for the Face Liveness check.

## Known Limitations

- Expo Go is not supported because this package includes native code.
- Web is not supported. The web implementation throws when used.
- Android theming options exposed by the underlying AWS Amplify UI SDK are not exposed by this module yet.
- Internationalization/localization is handled by the host app through native Android and iOS localization resources used by the underlying AWS Amplify UI SDKs.
- Apps must provide their own backend for session creation, temporary credentials, and result verification.

## Troubleshooting

If Android fails around the Compose compiler plugin, confirm that `composePluginVersion` matches the Kotlin version used by your Expo/React Native Android project.

If native permission or plugin changes are not reflected, run:

```bash
npx expo prebuild --clean
```

If the detector fails with credential errors, confirm that `setAuthCredentials` is called before rendering the detector and that the credentials have not expired.

## Potential Future Work

The following areas are candidates for future releases because they are supported by the underlying native SDKs but are not exposed through this Expo module yet:

- Android theming.
