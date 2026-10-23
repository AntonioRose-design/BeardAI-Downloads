# 👑 BeardAI — Official Downloads

## Latest public release — BeardAI 4.0 Royal Command Preview

**Published October 23, 2026.** The [4.0 prerelease](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v4.0.0-royal-command-preview) contains both Android and Windows files and [SHA-256 checksums](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.0-royal-command-preview/SHA256SUMS.txt). [GitHub Actions run](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40014377871) built both packages successfully.

- **[Android 4.0 APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.0-royal-command-preview/BeardAI-Android-v4.0.0-Royal-Command-Preview.apk)**
- **[Windows 4.0 ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v4.0.0-royal-command-preview/BeardAI-Windows-v4.0.0-Royal-Command-Preview.zip)**
- **[4.0 release memo](RELEASE_NOTES_v4.0.0-royal-command-preview.md)** · **[Announcements](ANNOUNCEMENTS.md)**

Includes the Royal Command responsive theme, Feedback Center for reviewed GitHub issue submissions, and a community chat implementation that attempts Supabase Realtime with 3-second polling fallback. Live-chat latency has not been verified on production service. **The 1,000-item roadmap is not 1,000 finished features.** iPhone/TestFlight is not available. Android debug APK may require reinstall if the signing certificate changed; back up data first.



## Royal Command 4.0 — preview in development

The next [Royal Command 4.0 source branch](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates) now contains a **modern responsive interface theme**, a Feedback Center (GitHub issue handoff), and a **Supabase Realtime WebSocket chat subscription with reconnect and 3-second polling fallback**. Actual instant chat depends on backend Realtime publication and authorization and has **not been live-service tested**. Windows 4.0 CI passed; public assets are **not yet attached to a new GitHub release**.

[See the explicitly numbered 1,000-feature engineering backlog](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_4_0_1000_FEATURES.md) — a design/acceptance backlog, **not 1,000 shipped features**. Ant Legion account automation is not implemented. iPhone has no downloadable app.



## Latest public release: 3.0.1 Royal Evolution Hotfix

**Status:** public **prerelease**. Android, Windows and publication jobs completed successfully on [GitHub Actions](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40012198311). This is a launcher/update hotfix and interactive companion preview, **not a release with 1,000 new features**.

| Platform | Latest download |
| --- | --- |
| Android | [BeardAI 3.0.1 APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v3.0.1-royal-evolution-hotfix/BeardAI-Android-v3.0.1-Royal-Evolution-Hotfix.apk) |
| Windows | [BeardAI 3.0.1 ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v3.0.1-royal-evolution-hotfix/BeardAI-Windows-v3.0.1-Royal-Evolution-Hotfix.zip) |
| iPhone | **No iOS app or TestFlight download yet**; [iOS source and checklist](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates/ios) |

[Read the GitHub release](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v3.0.1-royal-evolution-hotfix) · [Check SHA-256 sums](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v3.0.1-royal-evolution-hotfix/SHA256SUMS.txt) · [Detailed release notes](RELEASE_NOTES_v3.0.1-royal-evolution-hotfix.md) · [Latest announcements](ANNOUNCEMENTS.md)

### What is included

- Corrected Windows Royal Evolution branding, separate localhost port `18753`, and server health identity `BEARDAI_LOCAL_V300` to prevent reuse of an older instance.
- Opt-in Windows update checks and side-by-side installation mechanisms. End-to-end unattended updates, backup migration and desktop shortcut switching are not fully verified on consumer PCs.
- Android 3.0.1 version detection and the user-approved APK update workflow.
- In-app **Royal Tasks** with one-time, daily and weekly reminders, due counts, completion/rescheduling, deletion and JSON export. Due checks occur while the app is running—not background game control or guaranteed OS notifications.
- Mechanical Scorpion fusion planning and the existing field guide, Intel and community features.

### What is *not* included

**1,000 completed new features are not in this build.** The [100-feature roadmap](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_3_0_100_FEATURES.md) is planning material. Feedback Center work also exists in the development branch but **was not bundled into the public 3.0.1 build**. Likewise, there is no automated Ant Legion account control, finished iOS IPA, TestFlight release or hosted iPhone app.

### Installation and data safety

- **Windows:** Download and fully extract the ZIP, then launch `OPEN_BEARDAI_NOW.bat`. Back up existing Intel data before switching versions; storage tied to a localhost port may not migrate automatically.
- **Android:** Installation needs Android approval, and the debug APK's signing certificate may differ across releases. Export your data before replacing or uninstalling the prior version.
- **iPhone:** The development source is not an installable iOS application. Apple signing, Xcode/device validation and App Store Connect distribution remain outstanding.

[All previous releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases) · [Announcement archive](ANNOUNCEMENTS.md)

BeardAI is an independent Ant Legion companion project, not affiliated with Ant Legion or its publisher. Do not share Ant Legion passwords in the companion.
