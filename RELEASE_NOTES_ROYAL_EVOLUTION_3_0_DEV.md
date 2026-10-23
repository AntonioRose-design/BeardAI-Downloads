# BeardAI Royal Evolution — Developer Preview Release Candidate

**Important:** This is a **development preview**, not a completed BeardAI 3.0 general release. The public GitHub release remains 2.3.0 Rolling Stone until the two tested assets are uploaded to a new release.

## Android and Windows artifacts
- Android: `BeardAI-Royal-Evolution-Android-Development.apk` (SHA-256: `8f7d7f815cb0409f812fcc0490c5e4bd81825b80a59444fb4a88e6e515a94a40`)
- Windows: `BeardAI-Royal-Evolution-Windows-Development.zip` (SHA-256: `ecdd6af9568a06ef6e53aa569a41719556ee6928239e84628b1b5f68a110f951`)

## Functionality added in source
- Royal Tasks: one-time/daily/weekly scheduling, due count, completion/rescheduling, deletion and JSON backup export. Tasks work in the running app, not guaranteed OS background reminders.
- Windows opt-in verified update downloads and side-by-side installation with managed shortcut handling (real upgrade/rollback still needs device acceptance tests).
- Update Center for manual and launch-time release checking.
- Rolling Stone Intel: six independently configured Scorpion pieces, planner levels 1–10, 85 field guide entries.
- Community owner controls, activity presence and emoji reactions.

## iPhone
The iOS SwiftUI and XcodeGen starting sources are at [the iOS project](https://github.com/AntonioRose-design/BeardAI-Android/tree/beardai-2.2-community-media-updates/ios). **No IPA, TestFlight URL or iPhone web app is published.** Requires complete Xcode project/resources, macOS build, Apple signing, physical-device validation and App Store Connect distribution.

## Test evidence
- Android CI: https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40007261513
- Windows CI: https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40007268328

## Release process
Publish these matching files only after confirming the package contents, signing and minimum platform acceptance tests. GitHub release asset upload is not supported by the connected GitHub tooling, so the repository owner must upload these binaries through GitHub Releases. Do not claim all 100 proposed features exist.
