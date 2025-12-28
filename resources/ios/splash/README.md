# iOS Splash Screen

The splash screen is configured in `capacitor.config.ts` with a solid background color.

## For Custom Splash Images

After running `npx cap add ios`, you can customize the splash screen in Xcode:

1. Open the iOS project: `npx cap open ios`
2. Navigate to `App > Resources > Splash.storyboard`
3. Customize the storyboard with your logo/branding

## Required Splash Screen Sizes (if using images)

| Size | Device |
|------|--------|
| 2732x2732 | iPad Pro 12.9" |
| 2048x2732 | iPad Pro 12.9" Portrait |
| 2732x2048 | iPad Pro 12.9" Landscape |
| 1668x2388 | iPad Pro 11" Portrait |
| 2388x1668 | iPad Pro 11" Landscape |
| 1536x2048 | iPad Portrait |
| 2048x1536 | iPad Landscape |
| 1284x2778 | iPhone 14 Pro Max |
| 1179x2556 | iPhone 14 Pro |
| 1170x2532 | iPhone 14, 13, 12 |
| 1125x2436 | iPhone X, XS, 11 Pro |
| 828x1792 | iPhone XR, 11 |
| 750x1334 | iPhone 8, 7, 6s |
| 640x1136 | iPhone SE |

## Current Configuration

The app uses a solid color (#4A90A4) splash screen configured in Capacitor.
