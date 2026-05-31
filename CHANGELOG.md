# Changelog

## 0.1.0

Initial public release.

This version introduces the first working Expo module integration for AWS Amplify Face Liveness across iOS and Android, including native detector views, credential setup APIs, TypeScript types, config plugin support, and example app wiring.

### Added

- Expo native module wrapper for AWS Amplify Face Liveness.
- iOS Face Liveness detector view.
- Android Face Liveness detector view backed by Jetpack Compose.
- Temporary AWS credential configuration with `setAuthCredentials`.
- Temporary AWS credential clearing with `clearAuthCredentials`.
- TypeScript types for credentials, detector props, completion events, and error events.
- Config plugin for camera permissions, Android desugaring, and Android Compose compiler setup.
- Unsupported web entry points that throw clear errors.
- Example app wiring for the detector view.
