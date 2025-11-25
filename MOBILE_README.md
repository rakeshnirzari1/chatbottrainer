# ChatbotTrainer Mobile App Setup

This app is now configured with **Capacitor** for iOS and Android deployment!

## Prerequisites

### For iOS Development
- macOS computer
- Xcode 14+ installed
- CocoaPods installed (`sudo gem install cocoapods`)
- Active Apple Developer account

### For Android Development
- Android Studio installed
- Java JDK 17+ installed
- Android SDK installed (through Android Studio)

## Project Structure

```
chatbottrainer/
├── src/                    # React web app source
├── dist/                   # Built web assets
├── ios/                    # iOS native project (generated)
├── android/                # Android native project (generated)
├── capacitor.config.ts     # Capacitor configuration
└── package.json            # Dependencies and scripts
```

## Available Scripts

### Development
```bash
npm run dev                 # Start web development server
```

### Building & Syncing
```bash
npm run build              # Build web app
npm run cap:sync           # Build and sync to native platforms
```

### Opening Native IDEs
```bash
npm run cap:open:ios       # Open iOS project in Xcode
npm run cap:open:android   # Open Android project in Android Studio
```

### Running on Devices
```bash
npm run cap:run:ios        # Build, sync, and run on iOS
npm run cap:run:android    # Build, sync, and run on Android
```

## Step-by-Step Setup Instructions

### 1. Initial Setup (Already Done ✓)
- [x] Capacitor installed
- [x] iOS platform added
- [x] Android platform added
- [x] Mobile-optimized HTML meta tags added
- [x] Capacitor configuration complete
- [x] Essential plugins installed (SplashScreen, StatusBar, Keyboard)

### 2. iOS Setup

#### Install CocoaPods Dependencies
```bash
cd ios/App
pod install
cd ../..
```

#### Open in Xcode
```bash
npm run cap:open:ios
```

#### Configure iOS Project in Xcode
1. Select your development team in "Signing & Capabilities"
2. Update bundle identifier if needed (com.chatbottrainer.app)
3. Set deployment target to iOS 13.0+
4. Add app icons and splash screens
5. Configure capabilities (if needed):
   - Camera access
   - Photo library access
   - Network permissions

#### Run on iOS Device/Simulator
1. Select target device in Xcode
2. Click the Play button or press Cmd+R
3. Or use: `npm run cap:run:ios`

### 3. Android Setup

#### Open in Android Studio
```bash
npm run cap:open:android
```

#### Configure Android Project
1. Wait for Gradle sync to complete
2. Update app name in `android/app/src/main/res/values/strings.xml`
3. Add app icons:
   - Place icons in `android/app/src/main/res/mipmap-*` folders
4. Update package name if needed in `android/app/build.gradle`

#### Run on Android Device/Emulator
1. Connect Android device or start emulator
2. Click Run button in Android Studio
3. Or use: `npm run cap:run:android`

### 4. Making Changes

After modifying your React code:

```bash
# Rebuild and sync to native platforms
npm run cap:sync

# Or manually:
npm run build
npx cap sync
```

Then rebuild the native apps in Xcode or Android Studio.

## App Configuration

### App Information
- **App Name**: ChatbotTrainer
- **App ID**: com.chatbottrainer.app
- **Web Directory**: dist
- **Server Scheme**: HTTPS (for both iOS and Android)

### Installed Capacitor Plugins

1. **@capacitor/splash-screen**: Manages native splash screen
2. **@capacitor/status-bar**: Controls device status bar
3. **@capacitor/keyboard**: Manages native keyboard behavior

### Plugin Configuration

Located in `capacitor.config.ts`:

- **Splash Screen**: 2-second duration, blue background (#3B82F6)
- **Status Bar**: Light text, blue background
- **HTTPS Scheme**: Enabled for secure connections

## Environment Variables

Your `.env` file contains:
- Supabase configuration
- Stripe keys
- These will work in the mobile app automatically

## Important Mobile Considerations

### 1. API Endpoints
- All Supabase calls will work on mobile
- Ensure your Supabase project allows mobile origins
- Stripe integration may need updates for native payments

### 2. Authentication
- Email/password auth will work as-is
- Consider adding biometric authentication for mobile
- Handle deep links for password reset flows

### 3. Navigation
- React Router works on mobile
- Consider using native-style navigation for better UX
- Back button on Android should be handled properly

### 4. Responsive Design
- Your current design is already mobile-responsive
- Test on various screen sizes and orientations
- Consider tablet layouts for larger screens

### 5. Permissions
If you need to add native features:

```typescript
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

// Request permissions automatically when needed
```

### 6. App Store Deployment

#### iOS App Store
1. Create app in App Store Connect
2. Archive the app in Xcode
3. Upload to App Store Connect
4. Fill out app information and screenshots
5. Submit for review

#### Google Play Store
1. Create app in Google Play Console
2. Generate signed APK/AAB in Android Studio
3. Upload to Play Console
4. Fill out store listing and content rating
5. Submit for review

## Troubleshooting

### iOS Build Errors
```bash
# Clean build folder
cd ios/App
pod install --repo-update
cd ../..
npm run cap:sync
```

### Android Build Errors
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run cap:sync
```

### Web Assets Not Updating
```bash
# Force rebuild and sync
rm -rf dist
npm run build
npx cap sync
```

### Live Reload for Development
```bash
# In one terminal
npm run dev

# Update capacitor.config.ts with your local IP:
# server: { url: 'http://192.168.1.100:5173' }

# Then sync
npx cap sync
```

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS App Distribution Guide](https://developer.apple.com/distribute/)
- [Android App Publishing Guide](https://developer.android.com/studio/publish)
- [Ionic Documentation](https://ionicframework.com/docs)

## Next Steps

1. Test the app on real devices
2. Add app icons and splash screens
3. Configure push notifications (if needed)
4. Set up deep linking for marketing
5. Add analytics and crash reporting
6. Prepare store listings and screenshots
7. Submit to App Store and Google Play

## Support

For issues with:
- **Capacitor**: Check [Capacitor GitHub Issues](https://github.com/ionic-team/capacitor/issues)
- **Ionic**: Visit [Ionic Forums](https://forum.ionicframework.com/)
- **Your App**: Refer to your project documentation

---

**Your app is now ready for mobile development!** 🚀
