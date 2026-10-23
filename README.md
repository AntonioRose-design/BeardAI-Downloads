# 👑 BeardAI — Official Downloads

**Updater development:** A new Windows developer-branch utility now checks official releases, requests consent, verifies the downloaded ZIP using GitHub's SHA-256 digest, and stages it. It does **not** automatically replace running application files; tested backup/rollback is still required before promoting it as an automatic installer. Android currently links to official releases and still requires manual APK installation. The public 2.2.1 downloads do not contain this newer updater utility.

## 🪨 Rolling Stone Intel Expansion — Development Preview (October 23, 2026)

**The upcoming build adds 31 Intel guide playbooks**, bringing the field guide from 54 to **85 entries**, and corrects the Mechanical Scorpion Fusion Lab to support **player-specific gear levels 1 through 10** for each of six pieces. Existing level 7 progress remains tied to the player's saved data; new users are not presumed level 7. Ingredient costs are explicitly unknown until entered from in-game evidence. A new automated regression test covers level choices and guide expansion.

**Release status:** These improvements are committed on [the 2.2 development branch](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates). **They are not yet included in the public 2.2.1 Android or Windows downloads.** New binaries must be built, tested, and uploaded before labeling this publicly released. Automatic install remains unfinished.

## ✅ Latest public release: BeardAI 2.2.1 Owner Console Preview

**[📱 Download Android 2.2.1 APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.2.1-owner-preview/BeardAI-Android-v2.2.1-owner-preview.apk)** · **[🖥️ Download Windows 2.2.1 ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.2.1-owner-preview/BeardAI-Windows-v2.2.1-owner-preview.zip)**

[Release notes and checksums](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.2.1-owner-preview)

Includes the Owner Members Console (approve, deny, revoke), activity-based online/offline indicators, emojis, message reactions, and a manual/launch-time release checker. Both public assets have been verified as attached. **The release checker is not an automatic binary installer.** Users must still install a new Android APK or Windows ZIP themselves; do not tell users their existing installation auto-updates.

## 📱 Download BeardAI

### ✨ New: 2.2 Emoji Community Preview
**[⬇ Download BeardAI Android 2.2 Preview APK](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.2.0-dev/BeardAI-Android-2.2-dev-preview.apk)**

[View 2.2 preview release](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.2.0-dev) · **Experimental prerelease** · 46.6 MB

What's in this preview:
- 😀 Emoji picker inside community chat
- ❤️ 😂 🔥 👑 👍 🐜 Message reactions for approved members
- 🔔 In-app check for newer releases on official GitHub (view/download only)
- 💬 Existing General, Strategy, Events and Help chat rooms
- 🔒 Owner-controlled access with separate BeardAI accounts

**Not yet available:** GIF search/send, image attachments, silent update installation. Do not mistake this development preview for a finished 2.2 media release. Android-device and two-user end-to-end tests are still needed.

### 🛡️ Previous beta: 2.1.2
**[Download BeardAI Android 2.1.2 Beta](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/download/v2.1.2-beta/BeardAI-Android-v2.1.2-beta.apk)**

[All releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases) · [Report a bug or suggest a feature](https://github.com/AntonioRose-design/BeardAI-Downloads/issues)

## 👑 What is BeardAI?

BeardAI is an independent Android/Windows companion with Royal Mission Control, opt-in screen capture, on-device OCR, mission and Intel planning, and a separate invite-only player community. Its chat is **not** the official Ant Legion game chat.

## 🚀 Install and get started

1. Download the APK for your chosen version above.
2. Open it on Android and review the installation warning for this debug-signed beta. Updates can require reinstalling if signing keys differ; back up local data first.
3. Open BeardAI → Community Chat.
4. Register with an **independent BeardAI email/password** (never an Ant Legion password).
5. Verify your email and wait for owner approval.
6. Open General, Strategy, Events or Help and test chat. Emoji controls are in the **2.2 preview only**.

If the app detects a release, it can link you to the official GitHub page; normal Android APK installation always requires user approval.

## 🔐 Community rules and privacy

Membership approval is required; chat content is not end-to-end encrypted, and moderators can access it. Do not share private coordinates, passwords, verification codes or sensitive documents. Messages and reactions are hosted in Supabase. Report abuse rather than responding to it.

## 🧪 Beta testing

We welcome feedback on account sign-up, approval, Android chat loading, emoji/reaction delivery, and connectivity. **Media upload and GIF features are still under development.** Try a test account, not a game account.

**Independent project disclaimer:** BeardAI is not affiliated with, sponsored by, or endorsed by Ant Legion, 37GAMES, Google, or OpenAI. It does not provide autonomous in-game control.
