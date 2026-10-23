# BeardAI 3.0.1 — Royal Evolution Windows launcher and update hotfix

**Status:** prepared in source; **not public until GitHub Actions publication workflow succeeds**.

## Fixes
- Distinct Windows application and ZIP identity (Royal Evolution 3.0 instead of legacy 2.3 Rolling Stone).
- New localhost port `18753` and expected health marker `BEARDAI_LOCAL_V300` to avoid attaching to an older BeardAI server running on the previous port.
- Real Windows startup smoke test verifies localhost health, UI brand, community JS, and rejection of unexpected Host headers.
- Windows source includes opt-in update checks, SHA-256-verified side-by-side install, and managed desktop shortcut switching. Note that end-to-end migration between real public releases has not been verified.
- Android source version and update center aligned with `3.0.1` hotfix; APK installation still requires user approval and consistent signing keys.
- Royal Tasks and Scorpion Intel components remain development features.

## Automated publication
The private source repository has a one-click [Publish BeardAI public hotfix workflow](https://github.com/AntonioRose-design/BeardAI-Android/actions/workflows/publish-public-hotfix.yml) on the default branch. It checks out the development branch and builds both platforms, runs source and Windows launch tests, computes SHA-256 checksums, then uploads a separate `v3.0.1-royal-evolution-hotfix` prerelease on the public Downloads repository.

**One-time authorization required:** add a GitHub Actions repository secret named `BEARDAI_PUBLIC_RELEASE_TOKEN` to the private BeardAI-Android repository, using a fine-grained token limited to `AntonioRose-design/BeardAI-Downloads` with `Contents: Read and write`. Never post the token in issues, commits, README or chat. Then run the workflow manually. If credentials are missing it fails without claiming success.

This pipeline does not sign production Android APKs or iPhone IPAs. The Android output is debug-signed, and replacing a prior APK depends on matching Android signing certificates. iPhone still requires a valid Apple signing and TestFlight process.

## Public URLs after successful publication
- [Release](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v3.0.1-royal-evolution-hotfix)
- Android asset name: `BeardAI-Android-v3.0.1-Royal-Evolution-Hotfix.apk`
- Windows asset name: `BeardAI-Windows-v3.0.1-Royal-Evolution-Hotfix.zip`
- `SHA256SUMS.txt`
