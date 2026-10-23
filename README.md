# 👑 BeardAI — Official Android & Windows Downloads

> **Next update — 2.3.1 Update Center (development):** A global visible 🔔 Updates button, manual GitHub release check, and saved automatic-check-on-launch toggle have been added to the Android/Windows source branch. These features are **not yet included in the public 2.3.0 downloads**; a new compiled release is required. The setting automatically checks for updates, **not** silently installs them.

> **Windows 2.3.1 launcher hotfix (development; not yet in the public release):** A Windows startup conflict with earlier BeardAI builds was fixed by isolating the new local server on port 18743. The new ZIP is a single extractable desktop package instead of a ZIP nested inside a GitHub Actions artifact. Windows automatically checks for newer releases on launch and offers an approved, SHA-256-verified update download and side-by-side installation using `CHECK_BEARDAI_UPDATES.bat`; the old folder remains as rollback. Unattended installation and automatic local-data migration are not promised. This patch requires publishing a newer Windows release binary before existing users can download it from the public Releases page.

> **iPhone availability:** An iOS/iPhone edition is planned, **not yet downloadable**. The development repository now documents a hosted Safari Add-to-Home-Screen web app first, followed by a signed TestFlight iOS app. Android APKs cannot run on iPhone; iOS does not permit silent replacement of native apps or launcher icons.

## 👑 BeardAI 3.0 — Royal Evolution cross-platform project

**Development milestone (October 23, 2026):** Windows and Android Royal Tasks preview builds passed GitHub Actions; a shared Royal Tasks module adds local one-time, daily and weekly task reminders, a due counter, completion/rescheduling and JSON backup export. The [100-feature development roadmap](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_3_0_100_FEATURES.md) describes future upgrades, **not 100 shipped features**.

**iPhone status:** Initial [SwiftUI/WKWebView source](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ios/BeardAIApp.swift) and [TestFlight readiness checklist](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ios/TESTFLIGHT_RELEASE_CHECKLIST.md) are in the source branch. No Xcode archive, signed IPA, hosted iPhone app or TestFlight release has been produced. Apple developer signing, app configuration, testing and App Store Connect upload are still required.

**Current public downloads remain 2.3.0 Android APK + Windows ZIP below.** The newer Royal Tasks and updater development builds must be separately compiled, validated and publicly attached before they become official downloads.

## 🪨 Latest public release: BeardAI 2.3.0 — Rolling Stone Intel Expansion

**Released October 23, 2026 • Android APK and Windows portable desktop ZIP • Public preview**

**[📱 DOWNLOAD ANDROID 2.3 APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.3.0-rolling-stone-preview/BeardAI-Android-v2.3.0-Rolling-Stone-Preview.apk)**

**[🖥️ DOWNLOAD WINDOWS 2.3 ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.3.0-rolling-stone-preview/BeardAI-Windows-v2.3.0-Rolling-Stone-Preview.zip)**

[📜 Official 2.3 release](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.3.0-rolling-stone-preview) · [2.3 release notes and checksums](RELEASE_NOTES_v2.3.0-rolling-stone-preview.md) · [All versions](https://github.com/AntonioRose-design/BeardAI-Downloads/releases)

### What's new in Rolling Stone 2.3

- **Mechanical Scorpion Fusion Lab:** Each of six gear pieces has its own saved current level from **1 through 10**. Level 7 is not assumed for everyone; existing players retain their saved progress.
- Target levels **1–10**, tracking partially completed fusion stages and player-entered costs. Unknown ingredients remain unknown—not free.
- Per-piece gear audit, target-level mismatch warnings and missing recipe coverage.
- **31 additional Intel workflows**; the searchable offline Field Guide expands from **54 to 85 entries**.
- Intel playbooks for resource planning, OCR evidence review, gear progression, snapshots, cross-device backups and mission tracking.
- Community chat with owner approval/revoke controls, recently-online presence, emojis and reactions.
- Windows portable package contains a **consent-based, SHA-256-verified update download/staging utility**. It does **not** silently replace installed app files.
- Android can check official releases but **cannot automatically install** the new APK without the normal Android installer approval.

### Get started

**Android:** Download the APK above, open it, and approve installation if prompted. It is a preview/debug-signed APK; a differently signed earlier installation may not accept an in-place update. **Export your local Intel data before changing installations.**

**Windows:** Download the ZIP, extract it fully into a **new folder**, then run `OPEN_BEARDAI_NOW.bat`. Do not start the app from inside the ZIP. Export local Intel data first if switching folders. The package includes `CHECK_BEARDAI_UPDATES.bat` to check and stage newer verified packages. It is not a hands-off installation service.

**Community:** Register using a separate BeardAI email/password (never Ant Legion credentials), confirm email, and wait for the community owner to approve access. Community messages are not end-to-end encrypted.

### Download verification

- Android APK SHA-256: `91dad279aa8e9ee1e8f024cfbf4ec4b1cdff7d8779cfdf297643072683714a29`
- Windows ZIP SHA-256: `22cbbf89d307e7f0e37ed999cc88e2a72e8c319c378af52a0586183ed726ca1c`
- [Android build tests](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40003682686) · [Windows build and startup test](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40003730388)

CI verified builds and specific regression tests, **not** every device or upgrade path. Please report issues in [GitHub Issues](https://github.com/AntonioRose-design/BeardAI-Downloads/issues).

### Previous releases

- [2.2.1 Owner Console](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.2.1-owner-preview)
- [2.2.0 Emoji Preview](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.2.0-dev)
- [2.1.2 Beta](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.1.2-beta)

---

**About:** BeardAI is an independent, local-first Ant Legion companion for Intel planning, gear fusion tracking, opt-in OCR, verified references, progress snapshots and an owner-moderated community. Not affiliated with or endorsed by Ant Legion or its publisher. BeardAI does not connect to game accounts or perform autonomous gameplay.
