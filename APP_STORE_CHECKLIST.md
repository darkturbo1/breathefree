# Apple App Store Submission Checklist

## ✅ Completed in This Project

- [x] App ID configured: `app.oxyfree.quit`
- [x] App Name: `Oxyfree`
- [x] Capacitor iOS configured with proper settings
- [x] Splash screen plugin configured
- [x] Status bar plugin configured
- [x] App icon (1024x1024) available at `public/app-icon-1024.png`
- [x] PWA-ready viewport meta tags in index.html
- [x] Safe area insets handled

## 📱 Steps to Submit to App Store

### 1. Export Project to GitHub
- Click "Export to GitHub" in Lovable
- Clone the repository locally

### 2. Install Dependencies & Add iOS Platform
```bash
npm install
npx cap add ios
npx cap sync ios
```

### 3. Generate App Icons
- Go to https://appicon.co
- Upload `public/app-icon-1024.png`
- Download the generated icons
- Open Xcode: `npx cap open ios`
- Replace icons in `App > Assets.xcassets > AppIcon`

### 4. Configure Xcode Project
Open Xcode and configure:
- **Display Name**: Oxyfree
- **Bundle Identifier**: app.oxyfree.quit
- **Version**: 1.0.0
- **Build**: 1
- **Deployment Target**: iOS 14.0 or higher
- **Team**: Select your Apple Developer account

### 5. Add Required Capabilities (if needed)
In Xcode > Signing & Capabilities:
- Push Notifications (if using)
- In-App Purchase (already implemented for subscriptions)

### 6. Privacy Manifest (Required for iOS 17+)
Create `ios/App/App/PrivacyInfo.xcprivacy`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
</dict>
</plist>
```

### 7. App Store Connect Setup
1. Go to https://appstoreconnect.apple.com
2. Create a new app with Bundle ID: `app.oxyfree.quit`
3. Fill in required metadata:
   - **App Name**: Oxyfree - Quit Smoking
   - **Subtitle**: Track your smoke-free journey
   - **Category**: Health & Fitness
   - **Keywords**: quit smoking, stop smoking, health tracker, smoke free, nicotine, cessation
   
### 8. Required App Store Assets
- **Screenshots** (required sizes):
  - iPhone 6.7" (1290x2796)
  - iPhone 6.5" (1284x2778)
  - iPhone 5.5" (1242x2208)
  - iPad 12.9" (2048x2732)
- **App Preview** (optional but recommended)
- **App Icon** (1024x1024 - already have this)

### 9. App Description
```
Oxyfree helps you quit smoking and track your progress every step of the way.

FEATURES:
• Track your smoke-free days, hours, and minutes
• See money saved from not buying cigarettes
• Monitor your health improvements over time
• Journal your journey with mood and craving tracking
• AI Quit Coach for personalized support and motivation
• Achievement badges to celebrate milestones
• Beautiful, motivating dashboard

START YOUR SMOKE-FREE JOURNEY TODAY
Every cigarette not smoked is a victory. Oxyfree shows you exactly how far you've come and motivates you to keep going.

HEALTH MILESTONES
Watch as your body heals - from improved circulation within hours to reduced cancer risk over years.

FINANCIAL TRACKING
See exactly how much money you're saving by quitting. Set savings goals for something special.

DAILY JOURNAL
Track your mood and cravings to understand your patterns and stay accountable.

AI QUIT COACH
Get personalized advice and support from our AI coach whenever you need motivation or help with cravings.
```

### 10. Privacy Policy
You need a privacy policy URL. Include:
- What data is collected (email, smoking habits, journal entries)
- How data is stored (Supabase/encrypted)
- How data is used (personal tracking only)
- No data sold to third parties

### 11. Build & Archive
```bash
npm run build
npx cap sync ios
npx cap open ios
```
In Xcode:
1. Select "Any iOS Device" as target
2. Product > Archive
3. Distribute App > App Store Connect

### 12. TestFlight (Recommended)
- Upload to TestFlight first for testing
- Invite testers with email
- Get feedback before public release

### 13. Submit for Review
- Ensure all metadata is complete
- Add demo account credentials if needed
- Submit and wait 24-48 hours for review

## 🔧 For Production Release

Before going live, remove the hot-reload server URL from `capacitor.config.ts`:
```typescript
// Remove or comment out the server block for production
// server: {
//   url: "https://...",
//   cleartext: true
// }
```

Then rebuild and resubmit.

## 📋 App Review Guidelines to Consider

- Ensure all features work offline or handle offline gracefully
- Subscription features must work correctly
- All links must be functional
- No placeholder content
- No crashes or bugs
- Age rating: 4+ (health & fitness, no mature content)
