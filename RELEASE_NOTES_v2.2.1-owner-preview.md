# 👑 BeardAI 2.2.1 — Owner Console Community Preview

**Public prerelease | Android & Windows | October 23, 2026**

The newest BeardAI Community Preview gives the community owner greater control over membership.

## ✨ New features
- 👑 **Owner Members Console:** view registered and approved accounts, approve pending requests, deny requests or revoke membership. Access is enforced server-side using Supabase.
- 🟢 **Online/offline indicators:** recently active members show as online based on a periodic BeardAI heartbeat (roughly two-minute activity window); this is not Ant Legion online status.
- 😀 **Emoji composer and reactions:** add emoji to messages and react within the General, Strategy, Events and Help rooms.
- 🔔 **Update availability notices:** the app checks official GitHub Releases and provides a link when a newer version is available. It **does not silently install updates**.

## 📦 Installation
Download and install the APK on Android, or extract the Windows ZIP into a **new folder** and launch `OPEN_BEARDAI_NOW.bat`. Back up any locally stored BeardAI data before upgrading. Existing installations do not self-upgrade yet.

## 🧪 Validation
GitHub Actions Android build: https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40001271198
GitHub Actions Windows build: https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40001271097

Both builds completed successfully. The owner has reported the setup working; broad cross-device testing and in-place upgrade safety are not guaranteed.

## ⚠️ Known limits
GIF sharing and photo uploads are not implemented in this preview. No unattended Android or Windows installer is shipped. Android needs user-confirmed APK installation. The Windows version is a portable app, not a signed desktop installer.

## 🔐 Security
BeardAI is independent of Ant Legion. Never enter Ant Legion credentials. Community accounts require email verification and owner approval. Chat is not end-to-end encrypted.

SHA-256 digests of tested artifacts:
- Android APK: `4ee357ec9df78ec4806b1e0a94a3a21f9f1d84893a221b9549a056426010ebea`
- Windows ZIP: `ad1d88b633431c25212d23dc522c72152179f42a89ae4aed9e2f2163061df60e`
