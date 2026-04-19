# Web-0S-Windows98
A browser-based recreation of the classic Windows 98 desktop experience. This project is a front-end simulation of the Windows 98 operating system, built using HTML, CSS, and JavaScript. The goal was to replicate the look and feel of the original desktop environment as closely as possible, including its layout, visual style, and basic interactions.

## Features

- **Boot screen simulation** with progress bar and startup sound
- **Desktop environment**
  - Win98-style wallpaper
  - Clickable / double‑click desktop icons
  - Optional shortcut arrow overlay on selected icons
- **Taskbar**
  - Start button + Start menu
  - Taskbar tabs for open windows
  - Live updating clock (Win98-style tray look)
- **Window system**
  - Open/close windows
  - Focus active window (brings to front)
  - Minimize / maximize
  - Drag windows by the title bar
  - Resize windows using the bottom-right resizer
- **Shutdown dialog**
  - Shut down, restart, or cancel (simulated behavior)

---

## Tech Stack

- **HTML** for structure (`index.html`)
- **CSS** for the Windows 98 look (`styles/win98.css`)
- **Vanilla JavaScript** for behavior (`js/desktop.js`)

No frameworks and no build step required.

---

## Project Structure

- `index.html`  
  Main page layout (boot screen, desktop, taskbar, start menu, windows container).

- `styles/win98.css`  
  All styling for the desktop, icons, taskbar, Start menu, shutdown screens, and window UI.

- `js/desktop.js`  
  Controls the boot animation, desktop icons, Start menu logic, taskbar tabs, and the window manager.

- `assets/`  
  Images (icons, wallpaper), sound files, and the favicon.

---


## Customization

### Add or edit desktop icons
Icons are controlled in `js/desktop.js` inside `ICONS_DATA`.

Each icon supports:
- `name`: label on the desktop
- `app`: internal app id
- `icon`: image filename inside `assets/`
- (optional) `shortcut`: whether to show the shortcut arrow overlay


## Notes / Limitations

- This is a UI simulation for fun and nostalgia; it is not a full OS emulator.
- Some apps may be placeholders depending on what you’ve implemented so far.
- All UI logic and styling implemented with vanilla web technologies.

---
