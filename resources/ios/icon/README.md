# iOS App Icons

After running `npx cap add ios`, you'll need to add app icons in Xcode.

## Required Icon Sizes for App Store

Use the `public/app-icon-1024.png` file to generate all required sizes:

| Size | Usage |
|------|-------|
| 1024x1024 | App Store |
| 180x180 | iPhone App (60pt @3x) |
| 167x167 | iPad Pro App (83.5pt @2x) |
| 152x152 | iPad App (76pt @2x) |
| 120x120 | iPhone App (60pt @2x), iPhone Spotlight (40pt @3x) |
| 87x87 | iPhone Settings (29pt @3x) |
| 80x80 | iPad Spotlight (40pt @2x), iPhone Spotlight (40pt @2x) |
| 76x76 | iPad App (76pt @1x) |
| 58x58 | iPhone Settings (29pt @2x), iPad Settings (29pt @2x) |
| 40x40 | iPad Spotlight (40pt @1x), iPhone/iPad Notifications (20pt @2x) |
| 29x29 | iPad Settings (29pt @1x) |
| 20x20 | iPhone/iPad Notifications (20pt @1x) |

## How to Add Icons in Xcode

1. Open the iOS project: `npx cap open ios`
2. In Xcode, navigate to `App > Assets.xcassets > AppIcon`
3. Drag your icons to the appropriate slots
4. You can use https://appicon.co to generate all sizes from your 1024x1024 icon

## Recommended Tool

Visit https://appicon.co and upload `public/app-icon-1024.png` to automatically generate all required iOS icon sizes.
