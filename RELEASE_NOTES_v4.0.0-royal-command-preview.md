# BeardAI 4.0.0 Royal Command Preview — Release Notes

**Status: awaiting successful public publishing workflow.** This document is prepared ahead of release; publishing this file does not publish Android/Windows binaries.

## Implemented in the 4.0 development branch
- New Royal Command responsive dark interface and wider desktop layouts; keyboard focus styling and reduced-motion support.
- Community chat WebSocket subscription to Supabase Realtime with reconnect and a 3-second polling fallback while open. Realtime delivery depends on Supabase publication and permissions and has not been validated against the live service.
- Feedback Center: create a feature request, bug report, guide correction or automation idea, save a local draft, review a prefilled GitHub issue before submission. No automatic code deployments from feedback.
- Existing Royal Tasks: device-local one-time, daily and weekly reminders, completion/rescheduling, deletion and JSON export while app is open.
- Existing Intel, guide, and Mechanical Scorpion Fusion Lab, plus 4.0 version branding.
- [1,000-item detailed product backlog](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_4_0_1000_FEATURES.md). **These 1,000 entries are proposed development work, not 1,000 shipped functions.**

## Limitations
- Android APK is CI-generated debug build; it may not update over an old build signed with a different key. Export data before reinstalling.
- Windows localhost version migration may separate saved browser data. Back up before upgrading.
- Ant Legion account automation and reliable closed-app background task execution are not implemented.
- No iPhone IPA, TestFlight or hosted PWA has been released.
- A passing CI build is not proof of device compatibility or live Supabase latency.

## Public release target (works after publication)
- [Release v4.0.0](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v4.0.0-royal-command-preview)
- Android: `BeardAI-Android-v4.0.0-Royal-Command-Preview.apk`
- Windows: `BeardAI-Windows-v4.0.0-Royal-Command-Preview.zip`
- `SHA256SUMS.txt`

**Publishing:** [Run GitHub Actions publisher](https://github.com/AntonioRose-design/BeardAI-Android/actions/workflows/publish-public-hotfix.yml) on `main`. Wait for android, windows, and publish jobs to pass; verify assets on the new release page.