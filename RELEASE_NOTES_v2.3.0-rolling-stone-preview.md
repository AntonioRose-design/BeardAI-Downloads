# BeardAI 2.3 — Rolling Stone Intel Expansion (release candidate)

**Status: PUBLISHED — public Android and Windows preview assets confirmed attached to GitHub Release v2.3.0-rolling-stone-preview.**

## 31 new searchable Intel playbooks
The offline guide increases from 54 to 85 entries. New workflows cover ten individual Mechanical Scorpion levels, all six gear slots, partial fusion progress, component boxes, resource planning, evidence provenance, OCR review, progression snapshots, backup safety, mission handoff and member administration.

## Fusion Lab upgrade
- Each of six pieces has a separately saved current level, from 1 through 10.
- New profiles do not assume level 7; existing saved users keep their previous gear levels.
- Target level selection now supports levels 1 through 10.
- Plans only include levels above the actual saved level of each piece.
- Costs are editable per target level and fusion stage; missing figures remain **unknown**, never treated as zero.
- Per-piece audit and warnings for pieces already above the selected target.
- Review-import preserves existing costs, levels and materials.

## Intel improvements
- Per-piece progress audit in the calculator.
- Recipe coverage and unknown input report.
- Stronger target-mismatch feedback.
- 31 workflow playbooks explicitly labeled as checklists rather than official game facts.

## Release and updater limitations
Build pipelines include a regression test covering the full level range and guide count. Current Windows updater can ask permission to download, check SHA-256, and stage the file. It does not replace running app files. Android still requires manual user-approved APK installation. The latest public binaries are now v2.3.0 Rolling Stone; v2.2.1 is retained as an older preview.

## Publishing
Both files are now uploaded to [the public v2.3.0 Rolling Stone GitHub prerelease](https://github.com/AntonioRose-design/BeardAI-Downloads/releases/tag/v2.3.0-rolling-stone-preview). Earlier releases remain available for fallback.

## Validated build assets (2026-10-23)
- Android APK filename: `BeardAI-Android-v2.3.0-Rolling-Stone-Preview.apk`; SHA-256: `91dad279aa8e9ee1e8f024cfbf4ec4b1cdff7d8779cfdf297643072683714a29`.
- Windows ZIP filename: `BeardAI-Windows-v2.3.0-Rolling-Stone-Preview.zip`; SHA-256: `22cbbf89d307e7f0e37ed999cc88e2a72e8c319c378af52a0586183ed726ca1c`.
- Android CI (successful): https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40003682686
- Windows CI, including Windows launcher smoke test (successful): https://github.com/AntonioRose-design/BeardAI-Android/actions/runs/40003730388

The developer CI verifies compilation, JS syntax, the new regression test, archive and Windows startup; this is **not** a complete device compatibility or in-place update installation test.
