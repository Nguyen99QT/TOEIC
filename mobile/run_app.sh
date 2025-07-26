#!/bin/bash
# Script để chạy TOEIC Mobile App

echo "🚀 Starting TOEIC Mobile App..."

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first."
    echo "Visit: https://flutter.dev/docs/get-started/install"
    exit 1
fi

# Navigate to mobile directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
flutter pub get

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🔍 Checking for devices..."
flutter devices

echo "▶️ Running the app..."
flutter run

echo "✅ App started successfully!"
