# BeardAI Android — Privacy, permissions and educational use

_Last updated: October 23, 2026 · v0.2.0 testing beta_

## What the beta does

BeardAI is an independent, experimental Android computer-vision tool. Its on-device vision feature asks you to approve an Android screen-sharing session. While permission is active, it uses captured frames for preview and on-device text recognition (OCR).

## Information handled by this version

- **Screen pixels:** Frames from the screen or app you authorize Android to share.
- **Recognized text and bounding boxes:** Generated on the device by Google ML Kit OCR.
- **Optional local labels:** Account nicknames or planning entries that you choose to type.
- **Diagnostics:** In-app capture and recognition event logs, which you can choose to export using Android's share sheet.

No game credentials are requested by BeardAI, and the included implementation does not upload screenshots or OCR results to a BeardAI server. The app is not designed to access your email, contacts, payment information or game account passwords.

### Important screen-capture warning

Anything visible in an authorized capture may be processed, including notifications, private messages and personal data accidentally displayed while recording. **Do not start capture while viewing sensitive information.** Use the in-app stop control or Android's screen-sharing indicators to end a session promptly.

The app's current code is a test beta and has not been independently audited or certified for production use.

## Permissions

- **MediaProjection / screen sharing:** Requires your explicit Android approval to start screen capture.
- **Foreground service:** Keeps the user-authorized capture session visible and manageable through Android's ongoing notification.
- **Local storage:** Saves basic profile labels and task-planning entries on your device.

Actual permission wording can depend on Android version and manufacturer.

## Educational and third-party disclaimer

BeardAI is **not** an official product of Ant Legion, 37GAMES, Google or OpenAI and has no claimed affiliation, authorization or endorsement from them. All game names belong to their respective owners.

This version is an **educational software-development and portfolio project**. It does not automatically control game interfaces, play games autonomously, evade anti-cheat systems or bypass publisher restrictions. Educational purpose is not an exemption from app store rules, game terms, intellectual property rights or applicable law.

## Distribution and updates

This is a debug-signed APK provided for voluntary testing. Installation outside an app store carries risks; always confirm the download source and checksum. Later builds might have different debug signing keys and may require uninstalling this app before updating, which can erase local app data.

## Feedback

For defects or questions, open an issue in [BeardAI-Downloads](https://github.com/AntonioRose-design/BeardAI-Downloads/issues). Do **not** upload passwords, tokens, game login details or unredacted sensitive screenshots.
