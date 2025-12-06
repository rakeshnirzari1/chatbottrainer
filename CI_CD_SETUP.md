# CI/CD Setup Guide for Ionic Appflow

## The Problem You Encountered

Your build failed with this error:
```
[error] android platform has not been added yet.
```

This happened because the `android/` and `ios/` folders were not in your Git repository.

## The Solution ✅

### 1. Native Folders Are Now Committed

Unlike typical web projects, **Capacitor requires native project folders to be version controlled**.

The `.gitignore` has been updated to:
- ✅ Keep `android/` and `ios/` folders in Git
- ❌ Exclude build artifacts only (`.gradle/`, `build/`, `Pods/`, etc.)

### 2. Commit the Changes

Make sure to commit and push the native folders:

```bash
# Add the native project folders
git add android/ ios/

# Add other updated files
git add .gitignore capacitor.config.ts package.json package-lock.json

# Commit everything
git commit -m "Configure Capacitor for mobile deployment"

# Push to your repository
git push
```

### 3. Verify Your Repository

Before triggering another build, check that these folders exist in your repository:

```
your-repo/
├── android/
│   ├── app/
│   ├── build.gradle
│   ├── settings.gradle
│   └── ...
├── ios/
│   ├── App/
│   │   ├── App/
│   │   ├── App.xcodeproj
│   │   └── ...
└── capacitor.config.ts
```

## Ionic Appflow Build Configuration

### Build Settings

When creating a build in Ionic Appflow:

1. **Native Runtime**: Select **Capacitor**
2. **Build Type**:
   - Android: Select "Debug" or "Release"
   - iOS: Select "Debug" or "Release"
3. **Build Stack**: Use the latest version
4. **Environment**: Set any required environment variables

### Environment Variables

Your build will need these environment variables (if not already in `.env`):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

Add these in Appflow under: **Settings → Environments**

### Build Commands

Appflow will automatically detect and run:
1. `npm ci` - Install dependencies
2. `npm run build` - Build your web app
3. `npx cap sync` - Sync to native platforms
4. Build the native app (Android/iOS)

## Common Build Issues

### Issue 1: Missing Environment Variables

**Error**: Build succeeds but app crashes on launch

**Solution**: Add all environment variables in Appflow settings

### Issue 2: Android Gradle Errors

**Error**: Gradle build failures

**Solution**: Ensure you're using compatible versions:
- Check `android/build.gradle` for correct versions
- Update Capacitor plugins if needed

### Issue 3: iOS CocoaPods Errors

**Error**: Pod install failures

**Solution**:
- Appflow handles CocoaPods automatically
- If issues persist, check `ios/App/Podfile` configuration

### Issue 4: Web Assets Not Found

**Error**: White screen or missing assets

**Solution**: Verify `capacitor.config.ts` has:
```typescript
webDir: 'dist'
```

## Build Success Checklist

Before triggering a build:

- [ ] `android/` folder committed and pushed
- [ ] `ios/` folder committed and pushed
- [ ] `capacitor.config.ts` committed
- [ ] All environment variables set in Appflow
- [ ] Latest code pushed to Git repository
- [ ] `package.json` has correct scripts
- [ ] `.gitignore` updated (excludes only build artifacts)

## Testing Locally First

Before pushing to Appflow, test locally:

```bash
# Build the web app
npm run build

# Sync to native platforms
npx cap sync

# Open in native IDEs
npm run cap:open:android
npm run cap:open:ios

# Try running on device/emulator
```

If it works locally, it should work in Appflow!

## Alternative: GitHub Actions

If you prefer GitHub Actions over Appflow, here's a sample workflow:

```yaml
# .github/workflows/build-android.yml
name: Build Android

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build web app
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Build Android APK
        run: cd android && ./gradlew assembleDebug
```

## Getting Help

If you still encounter issues:

1. Check [Capacitor Docs](https://capacitorjs.com/docs)
2. Check [Ionic Appflow Docs](https://ionic.io/docs/appflow)
3. Review build logs carefully - they show exactly what failed
4. Ensure all files are committed to Git

## Success!

Once your build succeeds:
- Download the APK/IPA from Appflow
- Test on real devices
- Deploy to Google Play Store / Apple App Store

---

**Remember**: The key difference with Capacitor is that native folders (`android/` and `ios/`) must be committed to Git for CI/CD to work!
