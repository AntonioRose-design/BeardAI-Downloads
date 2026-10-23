# 👑 BeardAI — Official Downloads

## iPhone web app — GitHub Pages deployed

**[Open BeardAI on iPhone in Safari](https://antoniorose-design.github.io/BeardAI-Downloads/)**. GitHub Pages [deployment run 40016809022](https://github.com/AntonioRose-design/BeardAI-Downloads/actions/runs/40016809022) completed successfully and the `gh-pages` branch contains `index.html`, manifest, icons, Royal Workbench, and other frontend assets. On iPhone use **Share → Add to Home Screen**. **Safari behavior and Supabase login still require device testing.** The website is a free PWA, not a signed IPA or TestFlight app.


## Latest verified public release — 4.0.1 Royal Command Launcher Fix

The **[public 4.0.1 prerelease](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v4.0.1-royal-command-launcher-fix)** has passed Android, Windows and publishing jobs in [GitHub Actions](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40015513178).

- [📱 Download Android 4.0.1 APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.1-royal-command-launcher-fix/BeardAI-Android-v4.0.1-Royal-Command-Launcher-Fix.apk)
- [🖥️ Download Windows 4.0.1 ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.1-royal-command-launcher-fix/BeardAI-Windows-v4.0.1-Royal-Command-Launcher-Fix.zip)
- [🔐 SHA-256 checksums](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.1-royal-command-launcher-fix/SHA256SUMS.txt)
- [Release memo](RELEASE_NOTES_v4.0.1-royal-command-launcher-fix.md) · [Announcements](ANNOUNCEMENTS.md)

### What changed in 4.0.1

Windows 4.0 could display the old 3.0 build because both used the same local web-server identity. **4.0.1 separates Windows port `18754` and health marker `BEARDAI_LOCAL_V400`**. Android and the Update Center have aligned 4.0.1 version identifiers. Existing Royal Command visual design, Feedback Center, Royal Tasks, Intel/Fusion Lab, and conditional Realtime chat attempt remain.

**Note:** Automatic updates and local-data migration are not fully validated end-to-end. The Android APK is debug-signed and may require backup/reinstallation. The public release is a prerelease.

### Work in progress — features not yet released

The development branch has a new **Royal Workbench** for task/upgrade cards, priorities, stages, search, and JSON export. It was committed **after** the 4.0.1 publisher began and is not part of the verified public 4.0.1 build. More features need implementation, individual tests and new published binaries.

The [1,000-item engineering backlog](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_4_0_1000_FEATURES.md) is **not 1,000 completed features**. It lists future proposed work. There is no automated Ant Legion account control.

### Platform status

| Platform | Available |
| --- | --- |
| Android | Public 4.0.1 APK |
| Windows | Public 4.0.1 ZIP |
| iPhone | No published IPA or TestFlight; free hosted web app prepared but not yet verified live; [iOS source roadmap](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates/ios) |

Save a local backup before updating. BeardAI is an independent companion, not affiliated with Ant Legion. Never provide game account credentials.

[Source repository](https://github.com/AntonioRose-design/BeardAI-Android) · [Previous releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases)
