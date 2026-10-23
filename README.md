# 👑 BeardAI — Android Royal Mission Control

**Official public downloads for BeardAI Android**, an independent educational project exploring on-device computer vision, screen capture, and text recognition through a custom emerald-and-gold mobile dashboard.

**Beta status:** v0.2.0 (experimental). The Android APK **compiled successfully** through GitHub Actions, and an earlier version opened and captured the screen on one Android phone. The current build has not been broadly device-tested.

## 📱 Download BeardAI

**[View Android Releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases)**

When the `v0.2.0-beta` release is published, open it and download **`BeardAI-Android-v0.2.0-beta.apk`** from **Assets**. The download is intended to work for anyone without GitHub sign-in.

> **Release status:** The public repository is ready; **the APK release attachment is not published yet**. Until the file appears under Releases → Assets, do not mistake the build documentation for an actual download.

## What BeardAI does

- **Android screen sharing:** captures user-approved screen content with Android MediaProjection
- **On-device text recognition:** Google ML Kit OCR identifies visible Latin-script text
- **Vision diagnostics:** captures screenshot previews and highlights matched text regions
- **Royal Mission Control:** custom mobile UI with local profiles, a manual task planner and diagnostic logs
- **Privacy-conscious design:** local analysis without asking for game-account credentials

### Important limitations

**BeardAI does not autonomously play games**, control other apps, tap game interfaces, manage multiple game accounts, or bypass anti-cheat mechanisms. OCR can make mistakes; recognizing a menu title is **not** proof of verified game-state understanding. This is a technical demonstration, not a replacement for the official game client.

## Install on Android

1. From [Releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases), choose **v0.2.0-beta** once published.
2. Under **Assets**, download `BeardAI-Android-v0.2.0-beta.apk` on your Android phone.
3. Open **Files → Downloads**, select the APK, and review the installation prompts.
4. Open BeardAI. Grant screen-sharing permission **only when you choose to start AI Vision**.
5. Stop sharing once finished. Never screen-record passwords, payment details or private messages.

**Requirements:** Android 8.0 (API 26) or newer. This file is a **debug-signed Android beta**, not a Google Play release. Devices may display sideloading warnings. Different debug builds can use different signing keys and sometimes cannot update each other in place.

## Verify the APK

The current release candidate was produced by the [successful Android CI build](https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/39915994915). After downloading, you may compare its SHA-256 against [SHA256SUMS.txt](SHA256SUMS.txt).

## Release information

- [Beta release notes](RELEASE_NOTES_v0.2.0-beta.md)
- [Privacy and educational-use notice](PRIVACY_AND_DISCLAIMER.md)
- [Report feedback](https://github.com/AntonioRose-design/BeardAI-Downloads/issues)

## Portfolio and independence

This is an **independent educational software engineering project** demonstrating Android Java, MediaProjection, on-device OCR, JavaScript/WebView UI, Gradle, permission management and GitHub Actions CI. It is not sponsored, approved or endorsed by Ant Legion, 37GAMES, Google or OpenAI. Calling software educational does not waive intellectual property rights, game terms, platform rules or legal requirements.

**This is a public distribution and feedback repository only.** The development source is maintained separately in a private repository.
