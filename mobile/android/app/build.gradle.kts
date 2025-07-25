plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    compileSdk = 34
    ndkVersion = "27.0.12077973"

    defaultConfig {
        // ✅ Duy nhất một block defaultConfig
        applicationId = "com.toeicplatform.mobile"
        minSdk = 24 // ✅ quan trọng để chạy với flutter_sound
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    namespace = "com.toeicplatform.mobile"

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    source = "../.."
}
