# BeardAI 5.0 — Royal Workbench & Feature Compass Preview

**Status:** Public 5.0.0 prerelease published. [Android APK, Windows ZIP and SHA256SUMS.txt](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v5.0.0-royal-workbench-preview) are available and the [cross-platform publisher](https://github.com/AntonioRose-design/BeardAI-Android/actions/workflows/publish-5-release.yml) has passed. The [iPhone 5.0 Home Screen web app](https://antoniorose-design.github.io/BeardAI-Downloads/) is deployed on GitHub Pages.

## What this version actually includes

- Shared Royal Command interface revised with 5.0 build title.
- **Royal Workbench 5.0:** locally stored planning records; create/edit/remove; priorities, stages, optional target dates and notes; quick completion toggling; text filtering; JSON backup export and import with validation and explicit merge or replace confirmation. Imported backups support the older v1 format.
- **Feature Compass:** a searchable catalogue generated from **1,000 backlog requirements in 40 systems**. The default audit marks requirements **planned** until code, tests and release evidence are registered; this is **not 1,000 implemented features**.
- Existing Intel, Fusion Lab, Royal Tasks, Feedback Center and Community Chat integrations remain. Realtime chat requires correctly configured backend and Safari testing.
- **Android:** preview APK is debug-signed; installation may require data backup/reinstallation. This is not a Play Store release.
- **Windows:** packaged portable ZIP with localhost health/smoke checks, and 5.0 runs on a distinct localhost endpoint (127.0.0.1:18755, marker BEARDAI_LOCAL_V500) to avoid showing 4.x.
- **iPhone:** a **free Safari Home Screen web app**, not an App Store IPA, at https://antoniorose-design.github.io/BeardAI-Downloads/. Its code is deployed separately via GitHub Pages and requires real-device testing.

## Validation scope

The CI suite covers JavaScript syntax, Workbench data rules, roadmap indexing, Android APK compilation, Windows packaging/startup and web-app packaging. It does not substitute for physical-device compatibility, accessibility, end-to-end Supabase auth or testing each of the 1,000 planned future features.

## Safety and installation

Export local Workbench and Intel data before changing versions. Windows 5.0 uses a different localhost port, so browser storage may not automatically transfer from 4.0.1. Avoid entering Ant Legion credentials in BeardAI. No unauthorized game automation is included.

[Public releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases) · [Source and CI](https://github.com/AntonioRose-design/BeardAI-Android) · [Feature backlog](https://github.com/AntonioRose-design/BeardAI-Android/blob/main/ROADMAP_BEARD_AI_4_0_1000_FEATURES.md)
