# Backend Refactoring and Mobile Integration

## Overview

This document describes the refactoring process of the backend project structure and its integration with the Flutter mobile frontend. The main goal was to consolidate duplicate folders and similar files, particularly focusing on security and configuration classes.

## Refactoring Steps

### 1. Identifying Duplicate Components

The application had security configurations in two separate packages:

- `com.leenglish.api.security`
- `com.leenglish.toeic.security`

And configuration classes in:

- `com.leenglish.api.security`
- `com.leenglish.toeic.config`

### 2. Unified Structure

The project has been refactored to use a single, consistent structure:

- Security components moved to: `com.leenglish.toeic.security`
- Configuration classes consolidated in: `com.leenglish.toeic.config`
- Service classes moved to: `com.leenglish.toeic.service`

### 3. Key Changes

1. **JWT Authentication**:

   - Consolidated JwtRequestFilter in `com.leenglish.toeic.security`
   - Moved TokenBlacklistService to `com.leenglish.toeic.service`
   - Updated SecurityConfig to use JwtRequestFilter

2. **CORS Configuration**:

   - Marked `com.leenglish.toeic.config.CorsConfig` as the primary configuration
   - Enhanced CORS settings to support both web and mobile clients
   - Added proper origin patterns for Flutter apps

3. **Application Entry Point**:
   - Updated `ToeicBackendApplication.java` to scan both packages during the transition
   - This ensures backward compatibility while migrating to the new structure

## Mobile Integration

The mobile app integrates with the backend through:

1. **Authentication**:

   - JWT-based authentication with token storage using FlutterSecureStorage
   - Automatically adds Authorization headers to authenticated requests

2. **API Communication**:

   - Handles different base URLs for development and production
   - Supports Android emulator, iOS simulator, and physical devices
   - Provides proper error handling and logging

3. **CORS Configuration**:
   - Backend configured to accept requests from mobile origins
   - Special handling for Android emulator (10.0.2.2) and iOS simulator

## Next Steps

1. Complete the migration of any remaining classes from `com.leenglish.api` to `com.leenglish.toeic`
2. Update all imports throughout the project to reference the new package structure
3. Remove the ComponentScan annotation once migration is complete
4. Test the unified security configuration with both web and mobile clients
5. Thoroughly test JWT authentication flow in the mobile app
