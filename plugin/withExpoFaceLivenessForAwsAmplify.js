const {
  AndroidConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withAppBuildGradle,
  withInfoPlist,
  withSettingsGradle,
} = require("@expo/config-plugins");

const pkg = require("../package.json");

const DEFAULT_CAMERA_PERMISSION =
  "Allow this app to use the camera for face liveness verification.";
const DEFAULT_COMPOSE_PLUGIN_VERSION = "2.1.20";

const DESUGAR_DEPENDENCY =
  'coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.5")';

const addComposePluginResolution = (contents, version) => {
  if (contents.includes("org.jetbrains.kotlin.plugin.compose")) {
    return contents;
  }

  return contents.replace(
    /pluginManagement\s*\{/,
    `pluginManagement {
  repositories {
    mavenCentral()
  }
  plugins {
    id("org.jetbrains.kotlin.plugin.compose") version "${version}"
  }`,
  );
};

const addAppDesugaring = (contents) => {
  let nextContents = contents;

  if (!nextContents.includes("coreLibraryDesugaringEnabled true")) {
    nextContents = nextContents.replace(
      /android\s*\{/,
      `android {
    compileOptions {
        coreLibraryDesugaringEnabled true
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }`,
    );
  }

  if (!nextContents.includes("com.android.tools:desugar_jdk_libs")) {
    nextContents = nextContents.replace(
      /dependencies\s*\{/,
      `dependencies {
    ${DESUGAR_DEPENDENCY}`,
    );
  }

  return nextContents;
};

const withExpoFaceLivenessForAwsAmplifyBase = (config, props) => {
  const cameraPermission = props?.cameraPermission ?? DEFAULT_CAMERA_PERMISSION;
  const composePluginVersion =
    props?.composePluginVersion ?? DEFAULT_COMPOSE_PLUGIN_VERSION;

  config = withAndroidManifest(config, (config) => {
    AndroidConfig.Permissions.addPermission(
      config.modResults,
      "android.permission.CAMERA",
    );

    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = addAppDesugaring(config.modResults.contents);
    return config;
  });

  config = withSettingsGradle(config, (config) => {
    config.modResults.contents = addComposePluginResolution(
      config.modResults.contents,
      composePluginVersion,
    );
    return config;
  });

  config = withInfoPlist(config, (config) => {
    config.modResults.NSCameraUsageDescription = cameraPermission;
    return config;
  });

  return config;
};

module.exports = {
  withExpoFaceLivenessForAwsAmplify: createRunOncePlugin(
    withExpoFaceLivenessForAwsAmplifyBase,
    pkg.name,
    pkg.version,
  ),
};
