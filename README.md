
# Google Flow Favorite Shortcut

A lightweight Chrome extension that lets you favorite items in Google Flow using a keyboard shortcut.

Press the backslash (`\`) key to locate and click a visible, enabled Favorite button. The extension also plays a short beep after triggering the action.

## Features

- **Keyboard Shortcut:** Press `\` to trigger the Favorite action.
- **Multiple Detection Methods:** Searches for `aria-label="Favorite"`, `title="Favorite"`, and a `mat-icon` containing the text `favorite`.
- **Visibility Checks:** Checks whether the detected element is connected to the page and visible.
- **Clickability Checks:** Avoids clicking disabled elements and verifies that the target is a button or has `role="button"`.
- **Audio Feedback:** Plays a short, high-pitched beep after clicking the Favorite button.
- **Typing Protection:** Does not trigger the shortcut while typing in an input, textarea, select, or content-editable element.
- **Manifest V3:** Uses Chrome's Manifest V3 extension format.
- **Lightweight:** Uses a single content script without a background service worker or popup interface.

## Keyboard Shortcut

| Shortcut | Action |
|---|---|
| `\` | Find and click the detected Favorite button |

The shortcut is handled by a document-level keyboard event listener. It is ignored when the event originates from a supported text-entry element.

## Project Structure

```text
google-flow-favorite-shortcut/
├── manifest.json
├── content.js
└── icon.png
```

### File Overview

- `manifest.json` — Defines extension metadata, the icon, the content script, and the target website.
- `content.js` — Handles the keyboard shortcut, Favorite button detection, visibility and clickability checks, click action, and beep.
- `icon.png` — Supplies the extension icon.

## Requirements

- Google Chrome or a compatible Chromium-based browser.
- Access to [Google Flow](https://flow.google.com/).

## Installation

1. Download or clone this repository.
2. Extract the ZIP archive if necessary.
3. Open `chrome://extensions/` in Chrome.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted project folder containing `manifest.json`.
7. Open or reload Google Flow.

The content script is configured to run on pages matching:

```text
https://flow.google.com/*
```

## Usage

1. Open Google Flow.
2. Navigate to a page where the Favorite control is available.
3. Make sure the page is not focused on a supported text-entry element.
4. Press `\`.
5. The extension searches for a Favorite control, checks whether it can be clicked, and triggers the click.
6. If the action is triggered successfully, the extension attempts to play a short beep.

## How It Works

### 1. Keyboard Detection

The content script listens for `keydown` events and checks whether `event.key` equals `\`.

If another key is pressed, the handler exits without taking action.

### 2. Favorite Button Detection

The extension searches for a matching element using three methods, in this order:

1. An element with `aria-label="Favorite"`.
2. An element with `title="Favorite"`.
3. A button or element with `role="button"` containing a `mat-icon` whose text is `favorite`.

The label and title comparisons are case-insensitive and ignore extra whitespace.

### 3. Visibility Checks

Before clicking, the extension checks that the element:

- Is still connected to the document.
- Has a non-null `offsetParent`.
- Does not have `display: none`.
- Does not have `visibility: hidden`.
- Does not have computed opacity equal to `0`.

### 4. Clickability Checks

The extension stops if the detected element is disabled, has `aria-disabled="true"`, or has `pointer-events: none`.

It also requires the selected element to be a `<button>` or have `role="button"`.

### 5. Click and Audio Feedback

After the checks pass, the extension prevents the default keyboard action and calls `.click()` on the detected element.

It then attempts to generate an approximately 80-millisecond sine-wave beep at 800 Hz using the Web Audio API.

## Troubleshooting

### Pressing `\` Does Nothing

- Confirm the extension is enabled in `chrome://extensions/`.
- Reload the Google Flow page after installing or updating the extension.
- Make sure a supported text-entry element is not the event target.
- Open Chrome DevTools and check the console for messages beginning with `[Flow Favorite]`.

### Favorite Button Not Found

The extension relies on specific accessible labels, title attributes, or a Material icon containing `favorite`. If Google Flow changes its interface, the detection logic may need updating.

### Favorite Button Is Found but Not Clicked

The script checks visibility, disabled state, pointer events, and button semantics. A control that does not meet these checks will not be clicked.

### No Beep Is Heard

Audio playback may be restricted by browser policies or the current page context. The click action and audio feedback are separate steps, so a beep failure does not necessarily mean the click failed.

## Limitations

- The extension is designed specifically for Google Flow.
- It detects the first matching Favorite element in the document; it does not identify a particular card or image before selecting the button.
- The shortcut does not confirm whether the item was successfully added to favorites.
- The beep is attempted after the click but is not proof that the website accepted the action.
- The extension does not include configurable shortcuts, a popup, or a settings page.
- Changes to Google Flow's DOM structure may require updates to the detection logic.

## Contributing

Contributions and bug reports are welcome. Test changes against the current Google Flow interface, especially the Favorite button detection and keyboard event handling.

## License

No license file is included in the supplied project.

Add a `LICENSE` file if you want to specify the conditions for using, modifying, and redistributing this extension.
