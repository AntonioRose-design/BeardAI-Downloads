# 👑 BeardAI — Official Downloads

## Current public release: 4.0.0 Royal Command Preview

The [4.0.0 public prerelease](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v4.0.0-royal-command-preview) contains Android and Windows downloads. The Android, Windows and publishing jobs [passed GitHub Actions](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40014377871).

- **[Download BeardAI 4.0.0 Android APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.0-royal-command-preview/BeardAI-Android-v4.0.0-Royal-Command-Preview.apk)**
- **[Download BeardAI 4.0.0 Windows ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.0-royal-command-preview/BeardAI-Windows-v4.0.0-Royal-Command-Preview.zip)**
- [SHA-256 checksums](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.0-royal-command-preview/SHA256SUMS.txt) · [4.0.0 detailed release notes](RELEASE_NOTES_v4.0.0-royal-command-preview.md)

### Windows 4.0.1 launcher fix — release candidate, not yet public

**If your 4.0.0 Windows app still shows 3.0**, the launcher may be attaching to an older localhost server. The candidate 4.0.1 launcher uses port **18754** and `BEARDAI_LOCAL_V400` instead of the old 3.0 port **18753** and health marker. The 4.0.1 files must still be published and verified before they replace the links above.

[4.0.1 release memo](RELEASE_NOTES_v4.0.1-royal-command-launcher-fix.md) · [Automatic GitHub publisher](https://github.com/AntonioRose-design/BeardAI-Android/actions/workflows/publish-public-hotfix.yml) · [Latest announcements](ANNOUNCEMENTS.md)

### Current 4.0 companion functionality

Royal Command responsive layout, Feedback Center (user-reviewed GitHub issue composer), community chat with Supabase Realtime subscription attempts and three-second open-chat polling fallback, Royal Tasks while the app runs, Fusion Lab and Intel reference features. Live-service chat latency, consumer update migration and device-specific behavior are not fully tested.

### Long-term feature development

The [1,000-item engineering backlog](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_4_0_1000_FEATURES.md) is a *plan*, **not 1,000 completed software features**. BeardAI does not automate Ant Legion gameplay or automatically deploy code from feedback.

### Platform status and installation

| Platform | Status |
| --- | --- |
| Android | Public 4.0.0 prerelease; 4.0.1 candidate in development |
| Windows | Public 4.0.0 prerelease; known 3.0 localhost collision; 4.0.1 correction in development |
| iPhone | No IPA, hosted iPhone web app, or TestFlight build. [iOS development source](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates/ios) |

Back up saved data before changing builds. Windows localhost changes may separate saved browser data, and Android debug APKs may not update in place if their signing certificate changes. BeardAI is an independent Ant Legion companion, not affiliated with its publisher. Do not enter your Ant Legion password.

[Earlier GitHub releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases) · [Development source](https://github.com/AntonioRose-design/BeardAI-Android)
