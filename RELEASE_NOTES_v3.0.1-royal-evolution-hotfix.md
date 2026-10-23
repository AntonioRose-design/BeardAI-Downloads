# BeardAI 3.0.1 — Royal Evolution Hotfix

**Published:** October 23, 2026 · **Public prerelease** · [Download release](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v3.0.1-royal-evolution-hotfix)

### Official release assets
- [Android APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v3.0.1-royal-evolution-hotfix/BeardAI-Android-v3.0.1-Royal-Evolution-Hotfix.apk)
- [Windows ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v3.0.1-royal-evolution-hotfix/BeardAI-Windows-v3.0.1-Royal-Evolution-Hotfix.zip)
- [SHA-256 checksum file](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v3.0.1-royal-evolution-hotfix/SHA256SUMS.txt)

**Verification:** GitHub Actions [run 40012198311](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40012198311) passed the Android build, Windows build/launcher test and public publication jobs.

### Delivered in this build
- Correct Windows Royal Evolution branding and dedicated localhost port `18753` with `BEARDAI_LOCAL_V300` health identity, avoiding the legacy 2.3 instance collision.
- Windows opt-in update check, verified side-by-side update logic and managed shortcut mechanisms in source. Their full consumer-PC lifecycle and rollback have not been end-to-end validated.
- Android version updated to 3.0.1 with a manual, user-approved APK update path (debug APK signature compatibility not guaranteed).
- Royal Tasks running-app companion controls: local one-time/daily/weekly task scheduling, due count, completion, recurring reschedule, deletion and JSON export.
- The previously available fusion planning, Intel reference tools, searchable guide and community functions.

### Known limitations
- **This release does not contain 1,000 new implemented features.** The [100-feature plan](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_3_0_100_FEATURES.md) is a roadmap, not a shipped count.
- Feedback Center source added after the published 3.0.1 build; it requires a later build and public release to reach users.
- Tasks do not run in background after BeardAI closes and do not perform Ant Legion gameplay.
- iPhone: initial SwiftUI/iOS source exists; no IPA, TestFlight invitation, or hosted Safari app has been released.
- Android debug signing may prevent installation over previous builds. Export saved data before reinstalling.
- Windows origin/port changes can separate browser local storage; users should export backups before moving.

### Future releases
[Latest announcements](ANNOUNCEMENTS.md) will distinguish released features, implemented development work and proposed ideas. Future updates require tested binaries and publication through the GitHub workflow; feedback is not automatically converted into deployed code.
