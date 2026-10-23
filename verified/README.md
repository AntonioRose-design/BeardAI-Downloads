# BeardAI approved knowledge feed

This folder holds **published, editor-reviewed, source-linked factual claims** for BeardAI Android and Windows. It is **not** a submission inbox or a copy of personal screenshots, OCR captures, or Discord messages.

`approved-facts-v1.json` is a versioned JSON document, served over HTTPS by GitHub. Android and Windows users select **Check Approved Facts** to download approved data. Neither app automatically uploads personal screen data.

## Review policy
1. Collect candidate claims only through explicit user-selected sharing; never ingest private Discord channels or automatically upload screenshots.
2. Redact game account IDs, names, coordinates, private chats and other sensitive data. Review the evidence in private.
3. Attribute claims to a verifiable publisher-controlled source when available, preserving a version and timeframe.
4. Mark archived and historical claims as dated, never as guaranteed current gameplay.
5. Approve only claims with accessible source references. Unsupported observations remain **unverified**.
6. Publish an updated JSON file and increment `datasetVersion` after editorial review.

**Initial dataset:** 14 publisher-attributed facts from BeardAI's prior source-linked research. Their source pages may change and the app does not independently verify current live gameplay.

**Boundaries:** Discord API ingestion, centralized submission storage, automated moderation, automatic source fact-checking, and autonomous gameplay are not implemented. This is an editorial distribution mechanism.
