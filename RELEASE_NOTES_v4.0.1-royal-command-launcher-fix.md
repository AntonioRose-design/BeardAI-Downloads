# BeardAI 4.0.1 Royal Command Launcher Fix — Release Candidate

**Status:** Development candidate; no public 4.0.1 binaries until the automated Android/Windows publishing workflow passes and uploads real assets.

## Corrected Windows launcher behavior
- Windows 4.0.0 used the same localhost port and health identity as 3.0.1, allowing a fresh 4.0 shortcut to connect to an already-running 3.0 server.
- Windows 4.0.1 uses localhost port **18754** and health identity **BEARDAI_LOCAL_V400**. Builds and startup tests must verify both, including the 4.0 UI title.
- The updated release publisher prepares a separate `v4.0.1-royal-command-launcher-fix` prerelease instead of silently replacing 4.0.0.

## Existing 4.0 companion functionality
- Royal Command responsive theme, Feedback Center (review and submit an issue on GitHub), Royal Tasks, fusion/Intel tools, and Realtime chat attempt with three-second polling fallback. Actual live-chat latency remains unverified.
- The [1,000-item roadmap](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_4_0_1000_FEATURES.md) is **planning documentation and acceptance criteria, not 1,000 completed software features**. There is no 1,000-feature-complete release.

## Remaining limitations
Android preview APKs may be debug-signed differently; export data before replacing prior versions. The Windows port change may isolate browser local storage, so export Intel backups before moving from older versions. Account gameplay automation and iPhone IPA/TestFlight do not exist in these builds.

## Expected public files after successful publishing
- `BeardAI-Android-v4.0.1-Royal-Command-Launcher-Fix.apk`
- `BeardAI-Windows-v4.0.1-Royal-Command-Launcher-Fix.zip`
- `SHA256SUMS.txt`
