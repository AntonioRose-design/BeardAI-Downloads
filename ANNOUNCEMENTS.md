# BeardAI — Official Announcements

**New Era release-readiness tracker:** [Read the current GitLab protection, testing, and 11,000-feature acceptance status](https://github.com/AntonioRose-design/BeardAI-Android/issues/5). GitLab `main` has protected-branch rules and its CI setup merge request passed; its saved required-merge-check settings and GitLab→GitHub synchronization still require confirmation. **No 11,000-feature build has been certified or released.**

## October 24, 2026 — Pocket Field Guide source upgrade (private only)

Verified Knowledge in the private New Era branch now supports a **Pocket Field Guide**: save source-attributed Ant Legion facts locally, filter the saved shelf, jump to the next bookmarked fact and copy a source/version-aware note. The source catalog presently contains 30 attributed records, and older facts remain clearly marked historical. Direct core validation passed 38 isolated JavaScript assertions; full browser/Android/Windows/iPhone builds were **not run successfully**. The Feature Atlas now tracks **28 source-backed prototypes, zero release-certified features**, after also recording the already-implemented Shield Watch bundle. [Read the development guide](https://github.com/AntonioRose-design/BeardAI-Android/blob/new-era-11k-feature-lab/docs/NEW_ERA_POCKET_FIELD_GUIDE.md) (requires private access).

**No New Era public APK, Windows ZIP, or iPhone site deployment.** Public BeardAI 5.0 stays available unchanged. Build infrastructure blocker: [issue #6](https://github.com/AntonioRose-design/BeardAI-Android/issues/6).

## October 24, 2026 — New private player tools, public releases unchanged

The New Era development branch now includes **Alliance Field Operations**: four tap-to-check readiness playbooks, six copyable alliance announcements with Favorites, four playable tactical decisions, and locally backed-up progress. Recent Video Academy work also adds **Resume**, **Recently Watched**, and Clear Watch History. These are designed for players to actually use, not charts or placeholder lists. The private evidence ledger now records **26 prototypes and zero release-certified features**.

**Testing disclosure:** Field Operations passed 84 direct core assertions in an isolated JavaScript runtime. The Android APK, Windows ZIP, Safari bundle and real Android YouTube playback still require successful build/device verification. GitHub Actions hosted runners currently fail to start jobs. **Nothing from this update has been added to the public 5.0 installers or the live iPhone site.** [New Era roadmap](NEW_ERA_COMING_SOON.md) · [current 5.0 downloads](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v5.0.0-royal-workbench-preview).

## October 23, 2026 — Future New Era release placed on hold

**No new public BeardAI upgrade has been released.** The next ambitious release is being developed privately with a strict owner-requested freeze until the proposed 11,000 useful features are actually implemented, tested and approved. Early source prototypes include opt-in voice dictation, private chat attachments, verified role colors, time-aware themes and a friendly local Windows hostname. The production chat database, iPhone web app and 5.0 downloads have **not** been upgraded to those prototypes. [Development status and release policy](https://github.com/AntonioRose-design/BeardAI-Android) · [New Era source branch](https://github.com/AntonioRose-design/BeardAI-Android/tree/new-era-11k-feature-lab).


## October 23, 2026 — BeardAI 5.0 Royal Workbench & Feature Compass public preview

**Android, Windows and the free iPhone Safari web app now have public 5.0 distribution paths.**

- **[Android 5.0 APK and Windows 5.0 ZIP](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v5.0.0-royal-workbench-preview)** (preview binaries with SHA-256 checksums)
- **[iPhone Home Screen app](https://antoniorose-design.github.io/BeardAI-Downloads/)** (free GitHub Pages / Safari, no TestFlight or Apple subscription)
- **[5.0 release notes](RELEASE_NOTES_v5.0.0-royal-workbench-preview.md)**

New: Royal Workbench 5.0 task and upgrade management with structured edit, due dates, priorities, stages, completion toggles and validated JSON import/export. Feature Compass makes a **1,000-item roadmap** across 40 systems searchable. The items remain **planned until individually implemented and tested**; this does not claim 1,000 features were delivered.

Windows 5.0 deliberately separates itself from the 4.0.1 server with **localhost port 18755** and **BEARDAI_LOCAL_V500** health marker. Back up local data before moving between versions. The 5.0 suite was compiled and packaged with automated checks; real user-device tests and online-community service checks are separate.

## October 23, 2026 — 4.0.1 Windows launcher fix

[Version 4.0.1](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v4.0.1-royal-command-launcher-fix) addressed an older 3.0/4.0 local server collision and remains available as a previous version.

## October 23, 2026 — 4.0.0 Royal Command preview

[Version 4.0.0](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v4.0.0-royal-command-preview) introduced the Royal Command visual refresh, Feedback Center and attempted Supabase Realtime chat with fallback refresh.

BeardAI does not automatically operate Ant Legion game accounts. [Public homepage](README.md) · [All releases](https://github.com/AntonioRose-design/BeardAI-Downloads/releases)
