// ---- BOOT ANIMATION ----
let windowsArea = null;
const openWindows = [];
let windowZ = 2000, winIdInc = 0;

window.addEventListener("DOMContentLoaded", () => {
  // Cache DOM after it exists
  windowsArea = document.getElementById("windows");

  // Wire shutdown dialog buttons safely
  document.getElementById("shutdown-confirm").onclick = function () {
    document.getElementById("shutdown-screen").style.display = "none";
    document.getElementById("desktop").style.display = "none";
    document.getElementById("turnoff-screen").style.display = "";
    setTimeout(() => {
      document.getElementById("turnoff-screen").innerHTML =
        "<div>Goodbye!<br>You may now close the tab.</div>";
    }, 3000);
  };

  document.getElementById("restart-confirm").onclick = function () {
    window.location.reload();
  };

  document.getElementById("cancel-shutdown").onclick = function () {
    document.getElementById("shutdown-screen").style.display = "none";
    document.getElementById("desktop").style.display = "";
  };

  const bootScreen = document.getElementById("boot-screen");
  const bootProgress = document.querySelector("#boot-progress div");
  const desktop = document.getElementById("desktop");
  const bootAudio = document.getElementById("boot-audio");

  // Simulate loading
  setTimeout(() => (bootProgress.style.width = "100%"), 999);
  setTimeout(() => {
    bootScreen.style.display = "none";
    desktop.style.display = "";
    bootAudio.volume = 0.7;
    bootAudio.play().catch(() => {});
    showDesktopIcons();
    updateTime();
    setInterval(updateTime, 1000);
    setupTaskbar();
    setupStartMenu();
  }, 2500);
});

// ---- DESKTOP ICONS ----
const ICONS_DATA = [
  { name: "My Computer", app: "computer", icon: "computer.png", shortcut: false },
    { name: "Paint", app: "paint", icon: "paint.png",  },
  { name: "Calculator", app: "calculator", icon: "calculator_0.png", shortcut: true },
   { name: "Minesweeper", app: "minesweeper", icon: "mine.png", shortcut: true },
  { name: "Recycle Bin", app: "bin", icon: "recycle bin.png", shortcut: false,shortcut: true },
  { name: "Notepad", app: "notepad", icon: "notepad.png",  },
  { name: "Internet Explorer", app: "explorer", icon: "internet explorer.png", shortcut: true },
];
function showDesktopIcons() {
  const desktopIcons = document.getElementById("desktop-icons");
  desktopIcons.innerHTML = "";
  ICONS_DATA.forEach((icon) => {
    const div = document.createElement("div");
    div.className = "desktop-icon";
    div.tabIndex = 0;
  div.innerHTML = `
  <div class="icon-img-wrap">
    <img class="icon-img" src="assets/${icon.icon}">
    ${icon.shortcut ? `<img src="assets/shortcut.png" class="shortcut-arrow">` : ``}
  </div>
  <span>${icon.name}</span>
`;
    div.addEventListener("mousedown", () => {
      document.querySelectorAll(".desktop-icon").forEach((ic) => ic.classList.remove("selected"));
      div.classList.add("selected");
    });
    div.addEventListener("dblclick", () => openApp(icon.app));
    desktopIcons.appendChild(div);
  });
}

// ---- TASKBAR & CLOCK ----
function updateTime() {
  const now = new Date();
  let hr = now.getHours(),
    mn = now.getMinutes();
  const ampm = hr >= 12 ? "PM" : "AM";
  hr = hr % 12;
  if (hr === 0) hr = 12;
  mn = mn < 10 ? "0" + mn : mn;
  document.getElementById("taskbar-time").textContent = `${hr}:${mn} ${ampm}`;
}

function setupTaskbar() {
  document.getElementById("taskbar-programs").onclick = (e) => {
    let tab = e.target.closest(".taskbar-tab");
    if (!tab) return;
    let idx = openWindows.findIndex((w) => w.dom.tab === tab);
    if (idx >= 0) {
      let win = openWindows[idx].dom.win98win;
      win.style.display = "";
      focusWindow(win);
    }
  };
}

// ---- START MENU ----
function setupStartMenu() {
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");
  startBtn.addEventListener("click", (e) => {
    startMenu.style.display = startMenu.style.display === "none" ? "" : "none";
    e.stopPropagation();
  });
  document.body.addEventListener("click", () => (startMenu.style.display = "none"));

  startMenu.innerHTML = `
    <div class="start-menu-header">Windows 98</div>
    <div class="start-menu-section">
      <div class="start-menu-item programs">Programs
        <div class="start-menu-submenu">
          <div class="start-menu-item" onclick="openApp('notepad')">Notepad</div>
          <div class="start-menu-item" onclick="openApp('paint')">Paint</div>
          <div class="start-menu-item" onclick="openApp('minesweeper')">Minesweeper</div>
        </div>
      </div>
      <div class="start-menu-item" onclick="openApp('documents')">Documents</div>
      <div class="start-menu-item" onclick="openApp('settings')">Settings</div>
      <div class="start-menu-item" onclick="openApp('find')">Find</div>
      <div class="start-menu-item" onclick="openApp('run')">Run</div>
      <div class="start-menu-separator"></div>
      <div class="start-menu-item" onclick="showShutdown()">Shut Down...</div>
    </div>
  `;
}

// ---- WINDOW SYSTEM ----
function openApp(appId) {
  let win = openWindows.find((w) => w.appId === appId);
  if (win) return focusWindow(win.dom.win98win);

  let loader;
  switch (appId) {
    case "notepad":
      loader = window.NOTEPAD || ((c) => (c.innerHTML = "<textarea style='width:100%;height:100%'></textarea>"));
      break;
    case "calculator":
      loader = window.CALCULATOR || ((c) => (c.innerHTML = "Calculator here"));
      break;
    default:
      loader = (c) => (c.innerHTML = `<p>[${appId} app not yet implemented]</p>`);
      break;
  }

  const winDiv = document.createElement("div");
  winDiv.className = "win98-window";
  winDiv.tabIndex = 0;
  winDiv.style.left = 120 + Math.random() * 200 + "px";
  winDiv.style.top = 60 + Math.random() * 160 + "px";
  winDiv.style.width = "400px";
  winDiv.style.height = "265px";
  winDiv.id = `win${++winIdInc}`;
  winDiv.innerHTML = `
    <div class="win98-titlebar">
      <img class="fake-icon-title" src="assets/${ICONS_DATA.find((ic) => ic.app === appId)?.icon || "app.png"}">
      <span>${ICONS_DATA.find((ic) => ic.app === appId)?.name || appId}</span>
      <div class="win98-titlebar-buttons">
        <button class="win98-titlebar-btn btn-min">&minus;</button>
        <button class="win98-titlebar-btn btn-max">&#9723;</button>
        <button class="win98-titlebar-btn btn-close">&times;</button>
      </div>
    </div>
    <div class="win98-window-content"></div>
    <div class="win98-window-resizer"></div>
  `;

  // IMPORTANT: guard
  if (!windowsArea) throw new Error("#windows not found (windowsArea is null)");
  windowsArea.appendChild(winDiv);

  winDiv.style.zIndex = ++windowZ;

  loader(winDiv.querySelector(".win98-window-content"));

  winDiv.querySelector(".btn-close").onclick = () => closeWindow(winDiv);
  winDiv.querySelector(".btn-min").onclick = () => minimizeWindow(winDiv);
  winDiv.querySelector(".btn-max").onclick = () => maximizeWindow(winDiv);
  winDiv.onmousedown = () => focusWindow(winDiv);

  makeDraggable(winDiv, winDiv.querySelector(".win98-titlebar"));
  makeResizable(winDiv, winDiv.querySelector(".win98-window-resizer"));

  const tab = document.createElement("div");
  tab.className = "taskbar-tab active";
  tab.innerHTML = `<img src="assets/${ICONS_DATA.find((ic) => ic.app === appId)?.icon || "app.png"}" width=18> <span>${
    ICONS_DATA.find((ic) => ic.app === appId)?.name || appId
  }</span>`;
  tab.onclick = () => focusWindow(winDiv);
  document.getElementById("taskbar-programs").appendChild(tab);

  openWindows.push({ appId, dom: { win98win: winDiv, tab } });
  focusWindow(winDiv);
}

function focusWindow(win) {
  windowZ += 1;
  win.style.zIndex = windowZ;
  document.querySelectorAll(".win98-window").forEach((w) => w.classList.remove("active"));
  win.classList.add("active");
  openWindows.forEach((w) => {
    w.dom.tab.classList.remove("active");
    if (w.dom.win98win === win) w.dom.tab.classList.add("active");
  });
}

function closeWindow(win) {
  let i = openWindows.findIndex((w) => w.dom.win98win === win);
  if (i > -1) {
    windowsArea.removeChild(win);
    openWindows[i].dom.tab.remove();
    openWindows.splice(i, 1);
  }
}

function minimizeWindow(win) {
  win.style.display = "none";
}

function maximizeWindow(win) {
  if (win.classList.contains("maximized")) {
    win.style.left = win.dataset.oldLeft;
    win.style.top = win.dataset.oldTop;
    win.style.width = win.dataset.oldWidth;
    win.style.height = win.dataset.oldHeight;
    win.classList.remove("maximized");
  } else {
    win.dataset.oldLeft = win.style.left;
    win.dataset.oldTop = win.style.top;
    win.dataset.oldWidth = win.style.width;
    win.dataset.oldHeight = win.style.height;
    win.style.left = "0px";
    win.style.top = "0px";
    win.style.width = "100vw";
    win.style.height = "calc(100vh - 42px)";
    win.classList.add("maximized");
  }
}

function makeDraggable(win, handle) {
  let dragging = false,
    offX,
    offY;
  handle.onmousedown = function (e) {
    if (win.classList.contains("maximized")) return;
    dragging = true;
    offX = e.clientX - win.offsetLeft;
    offY = e.clientY - win.offsetTop;
    document.body.onmousemove = function (ev) {
      if (!dragging) return;
      win.style.left = ev.clientX - offX + "px";
      win.style.top = ev.clientY - offY + "px";
    };
    document.body.onmouseup = () => {
      dragging = false;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    };
    e.preventDefault();
  };
}

function makeResizable(win, resizer) {
  let resizing = false,
    startX,
    startY,
    startW,
    startH;
  resizer.onmousedown = function (e) {
    if (win.classList.contains("maximized")) return;
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startW = parseInt(win.style.width);
    startH = parseInt(win.style.height);
    document.body.onmousemove = function (ev) {
      if (!resizing) return;
      win.style.width = startW + (ev.clientX - startX) + "px";
      win.style.height = startH + (ev.clientY - startY) + "px";
    };
    document.body.onmouseup = () => {
      resizing = false;
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    };
    e.preventDefault();
  };
}

// ---- SHUTDOWN DIALOG ----
function showShutdown() {
  document.getElementById("shutdown-screen").style.display = "";
}

// ---- GLOBAL ACCESS ----
window.openApp = openApp;
window.showShutdown = showShutdown;