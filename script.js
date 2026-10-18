/* ==========================================================
   IULIA ROSHIOR / PORTFOLIO INTERACTIONS
   All interactions are initialized after the page markup loads.
   ========================================================== */

"use strict";

/* Timeline: keep one period expanded and its accessible state in sync. */
const timelinePeriods = [...document.querySelectorAll(".timeline .period")];

function updateTimelineHeight(period) {
  const panel = period?.querySelector(".card");
  const content = panel?.querySelector(".card-inner");
  if (panel && content && period.classList.contains("open")) {
    panel.style.maxHeight = `${content.scrollHeight}px`;
  }
}

function setTimelineOpen(period, expanded) {
  if (!period) return;

  const button = period.querySelector("button");
  const panel = period.querySelector(".card");
  if (!button || !panel) return;

  period.classList.toggle("open", expanded);
  button.setAttribute("aria-expanded", String(expanded));
  panel.setAttribute("aria-hidden", String(!expanded));
  panel.inert = !expanded;
  panel.style.maxHeight = expanded ? `${panel.querySelector(".card-inner").scrollHeight}px` : "0px";
}

function initializeTimeline() {
  // Resolve any inconsistent initial state to a single expanded period.
  const initiallyOpen = timelinePeriods.find((period) => period.classList.contains("open"));
  timelinePeriods.forEach((period) => {
    setTimelineOpen(period, period === initiallyOpen);

    period.querySelector("button")?.addEventListener("click", () => {
      const shouldOpen = !period.classList.contains("open");
      timelinePeriods.forEach((other) => setTimelineOpen(other, shouldOpen && other === period));
    });
  });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      timelinePeriods.forEach(updateTimelineHeight);
    });
    timelinePeriods.forEach((period) => {
      const content = period.querySelector(".card-inner");
      if (content) observer.observe(content);
    });
  } else {
    window.addEventListener("resize", () => timelinePeriods.forEach(updateTimelineHeight));
  }
}

initializeTimeline();

/* Hobbies: show only the selected inventory item's description. */
const LOOT = {
  "loot-music": {
    title: "Music",
    description: `Nu metal, heavy metal, metal vocals, '80s rock: for energy.
Ethnic trap and world bass: for focus.
Indie and folk: for everything else.`
  },
  "loot-games": {
    title: "Games",
    description: `Minecraft, Civilization V, The Witcher, The Last of Us, MOBAs,
and a soft spot for retro games from the Dendy and PS1 era.

"It doesn't look primitive when you understand how it works."

Palette tricks, sprite compression, counting CPU cycles.
The Silent Hill fog wasn't art: it was a hardware limitation
turned into an aesthetic.

Constraints breed creativity.`
  },
  "loot-stitch": {
    title: "Embroidery",
    description: `Slow craft. One stitch at a time: good training for
patience and attention to detail.

Same skills, different medium.`
  },
  "loot-paint": {
    title: "Painting",
    description: `Small canvases, candles lit, a theme for the evening,
brush in hand.

Quiet focus mode.`
  },
  "loot-walk": {
    title: "Night walks",
    description: `Lakeside paths next to a big park.
Fresh air, night sky, headphones on.

The best debugging happens away from the screen.`
  },
  "loot-drive": {
    title: "Road trips",
    description: `Long drives, music up, family outside the city.

Watching the road and the horizon is how I recharge.`
  },
  "loot-anime": {
    title: "Anime",
    description: `One Piece fan.
Over a thousand episodes of world-building,
loyalty, and never giving up: decent life philosophy, honestly.`
  },
  "loot-board": {
    title: "Board games",
    description: `Strategy nights with close friends.

No noisy parties needed: good company and a good game
beat a loud bar.`
  }
};

const lootPanel = document.getElementById("loot");
const inventoryButtons = [...document.querySelectorAll(".slot[data-loot]")];

inventoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = LOOT[button.dataset.loot];
    if (!item || !lootPanel) return;

    const deselect = button.getAttribute("aria-pressed") === "true";
    inventoryButtons.forEach((other) => {
      other.classList.remove("sel");
      other.setAttribute("aria-pressed", "false");
    });

    if (deselect) {
      lootPanel.classList.remove("show");
      lootPanel.replaceChildren();
      return;
    }

    button.classList.add("sel");
    button.setAttribute("aria-pressed", "true");
    const heading = document.createElement("h3");
    heading.textContent = item.title;
    const description = document.createElement("p");
    description.textContent = item.description;
    lootPanel.replaceChildren(heading, description);
    lootPanel.classList.add("show");
  });
});

/* Hidden terminal: accessible open, close, keyboard and outside-click behavior. */
const terminal = document.getElementById("terminal");
const terminalTrigger = document.getElementById("term-trigger");
const terminalClose = document.getElementById("term-close");
const terminalBody = document.getElementById("tbody");
const terminalInput = document.getElementById("tin");
const terminalInputRow = terminalBody?.querySelector(".t-in");

function setTerminalOpen(open, restoreFocus = false) {
  if (!terminal || !terminalTrigger) return;
  terminal.classList.toggle("up", open);
  terminal.setAttribute("aria-hidden", String(!open));
  terminal.inert = !open;
  terminalTrigger.setAttribute("aria-expanded", String(open));
  if (open) terminalInput?.focus();
  if (!open && restoreFocus) terminalTrigger.focus();
}

function printTerminal(text, isCommand = false) {
  if (!terminalBody || !terminalInputRow) return;
  const line = document.createElement("div");
  line.className = "t-output";
  if (isCommand) {
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "$ ";
    line.append(prompt);
  }
  line.append(document.createTextNode(text));
  terminalBody.insertBefore(line, terminalInputRow);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function clearTerminal() {
  terminalBody?.querySelectorAll(".t-output, .t-welcome").forEach((line) => line.remove());
}

const TERMINAL_COMMANDS = {
  help: () => "Commands: help, whoami, pwd, ls, ls ~/skills, cat /about/me, sudo hire-me, clear, exit",
  whoami: () => "student\ndeveloper\nmathematics enthusiast\ngamer\nnight walker",
  pwd: () => "/home/guest",
  ls: () => "about/  projects/  skills/  contact/",
  "ls ~/skills": () => "C  C++  Python  JavaScript  Linux  OOP  networking  HTML/CSS\n...and always learning",
  "cat /about/me": () => "Fast learner. Creative problem-solver. Years of client-facing work.\nCurrently: Applied Informatics, second year.\nStatus: available for freelance.",
  "sudo hire-me": () => {
    setTerminalOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    return "Access granted. Opening contact section...";
  },
  clear: () => {
    clearTerminal();
    return null;
  },
  exit: () => {
    setTerminalOpen(false, true);
    return "Session closed.";
  }
};

terminalTrigger?.addEventListener("click", () => {
  setTerminalOpen(!terminal.classList.contains("up"));
});
terminalClose?.addEventListener("click", () => setTerminalOpen(false, true));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && terminal?.classList.contains("up")) {
    event.preventDefault();
    setTerminalOpen(false, true);
  }
});

document.addEventListener("pointerdown", (event) => {
  if (terminal?.classList.contains("up") &&
      !terminal.contains(event.target) &&
      !terminalTrigger?.contains(event.target)) {
    setTerminalOpen(false);
  }
});

terminalInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing) return;
  event.preventDefault();
  const raw = terminalInput.value.trim();
  terminalInput.value = "";
  if (!raw) return;

  const command = raw.replace(/\s+/g, " ").toLowerCase();
  if (command === "clear") {
    clearTerminal();
    return;
  }

  printTerminal(raw, true);
  const handler = Object.prototype.hasOwnProperty.call(TERMINAL_COMMANDS, command)
    ? TERMINAL_COMMANDS[command]
    : null;
  const result = handler ? handler() : `Command not found: ${raw}. Type "help" for commands.`;
  if (result) printTerminal(result);
});

/* Before/after gallery: detect files on static hosting without a server API. */
(() => {
  const gallery = document.getElementById("restoration-gallery");
  if (!gallery) return;

  const root = "assets/restoration";
  const extensions = ["jpg", "jpeg", "png", "webp"];
  const maxIndex = 100;
  const maxConsecutiveMissing = 3;

  function checkImage(url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve({
        url,
        width: image.naturalWidth,
        height: image.naturalHeight
      });
      image.onerror = () => resolve(null);
      image.src = url;
    });
  }

  async function findImage(folder, index) {
    for (const extension of extensions) {
      const image = await checkImage(`${root}/${folder}/${index}.${extension}`);
      if (image) return image;
    }
    return null;
  }

  async function findPair(index) {
    // Original and restored files may use different extensions.
    const [before, after] = await Promise.all([
      findImage("Before", index),
      findImage("After", index)
    ]);
    return before && after ? { before, after } : null;
  }

  function createRestorationCard(pair, index) {
    const card = document.createElement("article");
    card.className = "restoration-card";
    const ratio = `${pair.after.width} / ${pair.after.height}`;

    // Image URLs are constructed from fixed local directories and numeric indices.
    card.innerHTML = `
      <div class="compare" data-compare style="--compare-split:50%;--photo-ratio:${ratio}">
        <img class="compare-after" src="${pair.after.url}" alt="Restored photograph ${index}" loading="lazy" decoding="async" draggable="false">
        <img class="compare-before" src="${pair.before.url}" alt="Original photograph ${index}" loading="lazy" decoding="async" draggable="false">
        <span class="compare-label compare-label--before" aria-hidden="true">Before</span>
        <span class="compare-label compare-label--after" aria-hidden="true">[ RESTORED ]</span>
        <span class="compare-divider" aria-hidden="true"><span class="compare-handle">◀ ▶</span></span>
        <input class="compare-range" type="range" min="0" max="100" step="1" value="50" aria-label="Reveal original photograph ${index}">
      </div>
      <div class="restoration-copy">
        <div><p class="project-type">Photo restoration · Before / After</p><h4>Restored photograph ${index}</h4></div>
        <span class="restoration-note">Drag to reveal ↔</span>
      </div>`;

    const slider = card.querySelector(".compare-range");
    const comparison = card.querySelector(".compare");
    const update = () => {
      comparison.style.setProperty("--compare-split", `${slider.value}%`);
      slider.setAttribute("aria-valuetext", `${slider.value}% of the original image visible`);
    };
    slider.addEventListener("input", update);
    update();
    return card;
  }

  async function loadRestorations() {
    let consecutiveMissing = 0;
    let loaded = 0;
    const status = gallery.querySelector(".restoration-loading");

    for (let index = 1; index <= maxIndex && consecutiveMissing < maxConsecutiveMissing; index++) {
      const pair = await findPair(index);
      if (!pair) {
        consecutiveMissing++;
        continue;
      }

      consecutiveMissing = 0;
      status?.remove();
      gallery.append(createRestorationCard(pair, index));
      loaded++;
    }

    if (!loaded) {
      gallery.classList.add("restoration-gallery--empty");
      gallery.textContent = "No restoration examples are available yet.";
    }
  }

  loadRestorations().catch(() => {
    gallery.classList.add("restoration-gallery--empty");
    gallery.textContent = "The restoration gallery could not be loaded.";
  });
})();
