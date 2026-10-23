# BeardAI — Official Announcements

## October 23, 2026 — 4.0.1 Royal Command Launcher Fix candidate

A Windows startup collision was confirmed: the public 4.0.0 Windows launcher can reuse an older BeardAI 3.0 localhost instance. **4.0.1 source** changes its localhost identity to port `18754` and marker `BEARDAI_LOCAL_V400`. Android versioning and the update center are also aligned to 4.0.1.

**Release status:** The corrected source and workflow are prepared; **4.0.1 is not yet published** as a public GitHub release. [Read the 4.0.1 memo](RELEASE_NOTES_v4.0.1-royal-command-launcher-fix.md) or [run the publisher](https://github.com/AntonioRose-design/BeardAI-Android/actions/workflows/publish-public-hotfix.yml) on `main`, then verify the Android, Windows and publish jobs.

## October 23, 2026 — 4.0.0 Royal Command Preview public

[BeardAI 4.0.0](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v4.0.0-royal-command-preview) was published with Android, Windows and checksums after CI success. It introduced Royal Command responsive styling, feedback issue submission, and Supabase live-chat connection attempts with three-second fallback polling. Royal Tasks, Fusion Lab and Intel remain companion tools. The live chat service and all consumer upgrade paths require more testing.

**Note:** The [1,000-item roadmap](https://github.com/AntonioRose-design/BeardAI-Android/blob/beardai-2.2-community-media-updates/ROADMAP_BEARD_AI_4_0_1000_FEATURES.md) is a development backlog, *not 1,000 completed features*. No iPhone IPA/TestFlight or Ant Legion gameplay automation is included.

## Earlier versions

- [3.0.1 Royal Evolution Hotfix](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v3.0.1-royal-evolution-hotfix)
- [3.0.0 Royal Evolution Developer Preview](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v3.0.0-royal-evolution-dev)
- [2.3.0 Rolling Stone Preview](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.3.0-rolling-stone-preview)

[Official homepage](README.md) · [All releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases)
