> **Windows 3.0 launcher hotfix:** The current 3.0 release's Windows ZIP still contains stale 2.3 branding and may reuse an older localhost process. A corrected Windows 3.0 package with a new localhost port and health identity has been built in the development branch and must replace the existing ZIP after its startup test. Until that asset is replaced, the current published Windows 3.0 file is NOT the corrected build.

## ✅ Royal Evolution 3.0 prerelease — partially published

The [3.0 development release](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v3.0.0-royal-evolution-dev) is public. The **[Windows Royal Evolution ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v3.0.0-royal-evolution-dev/BeardAI-Royal-Evolution-Windows-Development.zip)** is confirmed attached and its SHA-256 matches the documented checksum. **The Android Royal Evolution APK is not yet attached**; upload `BeardAI-Royal-Evolution-Android-Development.apk` to that same release. No iPhone IPA or TestFlight build is available. This is a developer prerelease, not completion of the 100-feature roadmap.

# 👑 BeardAI — Official Downloads & Cross-Platform Status

## 👑 Royal Evolution 3.0 — candidate builds prepared

**Newest development builds:** Android and Windows Royal Evolution packages have passed GitHub CI and have been packaged for the owner to attach to the next public prerelease. **These files are not yet on a public GitHub Release.** The installed application version/build labels remain 2.3.x, and the 100-feature roadmap is not fully implemented.

[Preview release notes, build evidence and SHA-256 digests](RELEASE_NOTES_ROYAL_EVOLUTION_3_0_DEV.md) · [100-feature roadmap](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_3_0_100_FEATURES.md)

**iPhone:** SwiftUI/XcodeGen development source exists, but **no valid IPA, TestFlight invitation or hosted PWA** has been released. A functioning Apple-signed iOS build requires Xcode, an Apple Developer team and App Store Connect.

## Download now — verified public files

**[📱 Android 2.3.0 Rolling Stone APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.3.0-rolling-stone-preview/BeardAI-Android-v2.3.0-Rolling-Stone-Preview.apk)**

**[🖥️ Windows 2.3.0 Rolling Stone ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.3.0-rolling-stone-preview/BeardAI-Windows-v2.3.0-Rolling-Stone-Preview.zip)**

**🍎 iPhone — not available to download yet.** An Android APK is not an iPhone app. There is no signed IPA, TestFlight invitation, or HTTPS-hosted iPhone PWA to link to yet. See [iPhone source and build plan](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates/ios). Do not trust websites offering an unofficial BeardAI IPA.

[All verified public releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases) · [2.3.0 release details](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.3.0-rolling-stone-preview)

## Royal Evolution 3.0 — development, not yet publicly published

Android and Windows Royal Tasks builds have passed CI on the [feature branch](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates). Their newer update-center and local task-management modules are **not yet represented by the public 2.3.0 files above**. The [100-feature roadmap](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_3_0_100_FEATURES.md) is a specification, not a list of completed features.

Current implemented development additions include an in-app due-task counter, one-time/daily/weekly task records, completion/rescheduling, JSON export, update-availability checking and Windows opt-in verified side-by-side update staging. True zero-touch upgrades and safe data migration still require validation.

### iPhone deployment requirements

An Apple-signed Xcode archive must be built with authorized Apple Developer credentials, tested on iPhone, uploaded to App Store Connect, and distributed through TestFlight. Alternatively, a secure HTTPS PWA can provide Safari access after the frontend has been adapted and deployed. Source code alone is **not** an installable iPhone app.

## Installing and data safety

- Android: APK installation requires approval. Back up saved Intel before uninstalling or switching signing keys.
- Windows: Fully extract the ZIP, then launch `OPEN_BEARDAI_NOW.bat`. Back up local Intel data before switching install folders.
- Community credentials belong to BeardAI, not Ant Legion. Never use your Ant Legion password. Chat is not end-to-end encrypted.

**Independent project disclaimer:** BeardAI is a community companion and is not affiliated with Ant Legion or its publisher. It does not autonomously operate the game.
