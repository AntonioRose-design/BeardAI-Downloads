# BeardAI 2.3 — Rolling Stone Intel Expansion (release candidate)

**Status: development build / NOT YET PUBLISHED as an APK or Windows download**

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
Build pipelines include a regression test covering the full level range and guide count. Current Windows updater can ask permission to download, check SHA-256, and stage the file. It does not replace running app files. Android still requires manual user-approved APK installation. Public v2.2.1 binaries are **not** the new release.

## Publishing
After the Android and Windows 2.3 candidate builds pass, upload the actual resulting APK and ZIP under a new GitHub prerelease `v2.3.0-rolling-stone-preview`. Do not overwrite the previous public release without confirming their hashes and installation behavior.
