/* =========================================
   TIMELINE ACCORDION
   ========================================= */

function toggle(button) {
  const period = button.parentElement;
  const card = period.querySelector(".card");
  const wasOpen = period.classList.contains("open");

  // Close all other periods
  document.querySelectorAll(".period.open").forEach((item) => {
    item.classList.remove("open");

    const itemCard = item.querySelector(".card");
    if (itemCard) {
      itemCard.style.maxHeight = null;
    }
  });

  // Open selected period
  if (!wasOpen) {
    period.classList.add("open");

    if (card) {
      card.style.maxHeight = card.scrollHeight + "px";
    }
  }
}


/* =========================================
   INVENTORY / HOBBIES
   ========================================= */

const LOOT = {
  "loot-music": {
    t: "Music",
    d: `New metal, hard metal, metal vocals, '80s rock — for energy.
Ethnic trap and world bass — for focus.
Indie and folk — for everything else.`
  },

  "loot-games": {
    t: "Games",
    d: `Minecraft, Civilization V, The Witcher, The Last of Us, MOBAs —
and a soft spot for retro games from the Dendy and PS1 era.

"It doesn't look primitive when you understand how it works."

Palette tricks, sprite compression, counting CPU cycles.
The Silent Hill fog wasn't art —
it was a hardware limitation turned into aesthetic.

Constraints breed creativity.`
  },

  "loot-stitch": {
    t: "Embroidery",
    d: `Slow craft. One stitch at a time —
good training for patience and attention to detail.

Same skills, different medium.`
  },

  "loot-paint": {
    t: "Painting",
    d: `Small canvases, candles lit, a theme for the evening,
brush in hand.

Quiet focus mode.`
  },

  "loot-walk": {
    t: "Night walks",
    d: `Lakeside paths next to a big park.
Fresh air, night sky, headphones on.

The best debugging happens away from the screen.`
  },

  "loot-drive": {
    t: "Road trips",
    d: `Long drives, music up, family outside the city.

Watching the road and the horizon is how I recharge.`
  },

  "loot-anime": {
    t: "Anime",
    d: `One Piece fan.
Over a thousand episodes of world-building,
loyalty, and never giving up —
decent life philosophy, honestly.`
  },

  "loot-board": {
    t: "Board games",
    d: `Strategy nights with close friends.

No noisy parties needed —
good company and a good game beat a loud bar.`
  }
};


const lootElement = document.getElementById("loot");
const slots = document.querySelectorAll(".slot");

slots.forEach((slot) => {
  slot.addEventListener("click", () => {

    // Remove selection from all slots
    slots.forEach((item) => {
      item.classList.remove("sel");
    });

    // Select current slot
    slot.classList.add("sel");

    const lootId = slot.dataset.loot;
    const loot = LOOT[lootId];

    if (!loot) {
      return;
    }

    // Insert content
    lootElement.innerHTML = `
      <h3>${loot.t}</h3>
      <p style="white-space: pre-line">${loot.d}</p>
    `;

    // Show description
    lootElement.classList.add("show");
  });
});


/* =========================================
   TERMINAL
   ========================================= */

const terminal = document.getElementById("terminal");
const terminalBody = document.getElementById("tbody");
const terminalInput = document.getElementById("tin");
const terminalTrigger = document.getElementById("term-trigger");

const terminalClose = document.getElementById("term-close");

terminalClose.addEventListener("click", () => {
  terminal.classList.remove("up");
});


/* Open terminal */

terminalTrigger.addEventListener("click", () => {
  terminal.classList.add("up");
  terminalInput.focus();
});


/* Close terminal with Escape */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    terminal.classList.remove("up");
  }
});


/* Terminal commands */

const CMDS = {
  help: () =>
    `available: whoami, cat /about/me, ls ~/skills, sudo hire-me`,

  whoami: () =>
    `student
developer
mathematics enjoyer
gamer
night walker`,

  "cat /about/me": () =>
    `Fast learner. Multitasker. Thirteen years of client-facing work.
Currently: Applied Informatics, 2nd year.
Status: available for freelance.`,

  "ls ~/skills": () =>
    `C  C++  Python  JavaScript  Linux  OOP  networking  HTML/CSS
+ whatever you need (give me a week)`,

  "sudo hire-me": () => {
    setTimeout(() => {
      document
        .getElementById("contact")
        .scrollIntoView({
          behavior: "smooth"
        });
    }, 800);

    return "access granted. redirecting to contacts...";
  }
};


/* =========================================
   TERMINAL INPUT
   ========================================= */

terminalInput.addEventListener("keydown", (event) => {

  // Only Enter executes a command
  if (event.key !== "Enter") {
    return;
  }

  const value = terminalInput.value.trim().toLowerCase();

  // Clear input
  terminalInput.value = "";

  // Don't do anything for empty command
  if (!value) {
    return;
  }

  // Print entered command
  echo(`<span class="prompt">$</span> ${escapeHTML(value)}`);

  // Execute command
  if (CMDS[value]) {
    const result = CMDS[value]();

    echo(escapeHTML(result));
  } else {
    echo(
      `command not found: ${escapeHTML(value)} — try "help"`
    );
  }

  // Scroll terminal to bottom
  terminalBody.scrollTop = terminalBody.scrollHeight;
});


/* =========================================
   TERMINAL OUTPUT
   ========================================= */

function echo(html) {
  const line = document.createElement("div");

  line.innerHTML = html;

  const inputLine = terminalBody.querySelector(".t-in");

  terminalBody.insertBefore(line, inputLine);
}


/* =========================================
   HTML ESCAPE
   Prevents user input from becoming HTML
   ========================================= */

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* =========================================
   OPEN CURRENT TIMELINE ITEM
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const openedPeriod = document.querySelector(".period.open");

  if (openedPeriod) {
    const card = openedPeriod.querySelector(".card");

    if (card) {
      card.style.maxHeight = card.scrollHeight + "px";
    }
  }
});


/* =========================================
   UPDATE ACCORDION HEIGHT ON RESIZE
   ========================================= */

window.addEventListener("resize", () => {
  const openedPeriod = document.querySelector(".period.open");

  if (!openedPeriod) {
    return;
  }

  const card = openedPeriod.querySelector(".card");

  if (card) {
    card.style.maxHeight = card.scrollHeight + "px";
  }
});