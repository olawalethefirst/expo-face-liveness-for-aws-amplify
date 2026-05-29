import {
  FaceLivenessDetectorView,
  setAuthCredentials,
  type AuthCredentials,
} from "expo-face-liveness-for-aws-amplify";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_FACE_LIVENESS_API_URL;

type LivenessSession = {
  sessionId: string;
  region: string;
};

type LivenessSessionResponse = LivenessSession & {
  credentials: AuthCredentials;
};

export default function App() {
  const [livenessSession, setLivenessSession] =
    useState<LivenessSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setup() {
      if (!API_BASE_URL) {
        setError("EXPO_PUBLIC_FACE_LIVENESS_API_URL is not configured.");
        return;
      }

      const cameraPermission = await Camera.requestCameraPermissionsAsync();

      if (!cameraPermission.granted) {
        setError("Camera permission is required for face liveness verification.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/face-liveness/session`, {
        method: "POST",
      });
      const data = (await response.json()) as LivenessSessionResponse;

      await setAuthCredentials(data.credentials);

      setLivenessSession({
        sessionId: data.sessionId,
        region: data.region,
      });
    }

    setup().catch((error) => {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to start liveness session.",
      );
    });
  }, []);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!livenessSession) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FaceLivenessDetectorView
        sessionId={livenessSession.sessionId}
        region={livenessSession.region}
        disableStartView
        style={styles.detector}
        onAnalysisComplete={async (event) => {
          const completedSessionId = event.nativeEvent.sessionId;
          const resultResponse = await fetch(
            `${API_BASE_URL}/face-liveness/session/${completedSessionId}/result`,
          );
          const result = await resultResponse.json();

          Alert.alert(
            "Successful",
            `Confidence: ${result.confidence ?? "unavailable"}`,
          );
        }}
        onError={(event) => {
          console.log("Face liveness error:", event.nativeEvent);
          setError(event.nativeEvent.message);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  container: {
    flex: 1,
  },
  detector: {
    flex: 1,
  },
  error: {
    color: "#b00020",
    textAlign: "center",
  },
});
