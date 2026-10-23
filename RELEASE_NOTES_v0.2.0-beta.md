# BeardAI Android v0.2.0-beta — Public testing release

**Status:** Public educational beta available. APK verified with SHA-256; real-device testing of this exact build remains incomplete.

**[Download APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v0.2.0-beta/BeardAI-Android-v0.2.0-beta.apk)**

BeardAI Royal Mission Control is a standalone Android screen-analysis learning project. It has a royal-themed dashboard and permission-based, on-device computer vision. It is **not** a game automation bot.

## Features included
- Android MediaProjection with an explicit user screen-sharing prompt and foreground capture notification
- Google ML Kit OCR (Latin-script) running on-device
- Captured frame previews, keyword-based text matches and local diagnostic logs
- Account *labels* and manual task planning (no game logins or automatic control)
- Gold-and-emerald Royal Mission Control interface

## Testing evidence
- Debug APK was compiled by GitHub Actions on **October 23, 2026**.
- One device previously installed and opened BeardAI, and screen capture was confirmed.
- This exact updated APK has **not** been retested on a range of Android models.
- Text recognition and screen-hint results are **not** validated gameplay-state detection.

## Installation
1. Download `BeardAI-Android-v0.2.0-beta.apk` from the published release's **Assets**.
2. Open it in Android's Files app and review sideloading and permission prompts.
3. Start screen analysis only with explicit permission and end sharing when finished.

### Trust and integrity
**SHA-256:** `ea71fd9983cb99705f94db2357a5d5deff77de4098e6d9815a24820aa6efc9e0`

This is a **debug-signed test APK**, not a signed Play Store release. Its key might differ between builds. If Android refuses an in-place upgrade due to a signature mismatch, backing up locally stored data and reinstalling may be necessary.

### Educational-purpose disclaimer
An independent software-engineering demonstration, unaffiliated with and not endorsed by **Ant Legion, 37GAMES, Google, or OpenAI**. It does not perform autonomous gameplay or anti-cheat evasion. Follow applicable rights, app policies and game terms. Permission-based screen capture can incidentally include sensitive content; users must avoid capturing confidential screens.

### Feedback
Open a [GitHub issue](https://github.com/AntonioRose-design/BeardAI-Downloads/issues) describing the Android version, phone model, steps to reproduce and observed behavior. Remove account identifiers and sensitive information from screenshots and logs.
