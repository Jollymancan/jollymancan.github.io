(() => {
  const root = document.documentElement;

  let typingTimeouts = [];

  function clearTypingTimeouts() {
    typingTimeouts.forEach(t => clearTimeout(t));
    typingTimeouts = [];
  }

  function later(fn, ms) {
    const t = setTimeout(fn, ms);
    typingTimeouts.push(t);
    return t;
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;

    const btn = document.getElementById("themeToggle");
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const next = root.dataset.theme === "light" ? "dark" : "light";
        root.dataset.theme = next;
        localStorage.setItem("theme", next);
      });
    }
  }

  function initActiveNav() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".links a").forEach(a => {
      a.classList.remove("active");
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path) a.classList.add("active");
    });
  }

  function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  function initTypingHeadline() {
    clearTypingTimeouts();

    const punct = document.getElementById("punct");
    const wrap = document.getElementById("typedWrap");
    const typedText = document.getElementById("typedText");
    const cursor = document.getElementById("typedCursor");

    // Not on home (or elements missing)
    if (!punct || !wrap || !typedText || !cursor) return;

    // Reset to a clean initial state every time we land here
    punct.textContent = ".";
    typedText.textContent = "";
    wrap.classList.add("hidden");
    cursor.classList.remove("hidden");

    const words = ["...a student?", "...a gamer?", "...a researcher?", "a learner."];

    // Slower pacing
    const typeSpeed = 140;
    const deleteSpeed = 95;
    const pauseAfterType = 1200;
    const pauseAfterDelete = 500;

    // How long "Hi, I'm Pranit." stays before the comma edit
    const initialPeriodHold = 1800;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function finish() {
      later(() => cursor.classList.add("hidden"), 700);
    }

    function tick() {
      const current = words[wordIndex];

      if (!deleting) {
        charIndex++;
        typedText.textContent = current.slice(0, charIndex);

        if (charIndex >= current.length) {
          if (wordIndex === words.length - 1) {
            finish();
            return;
          }
          deleting = true;
          later(tick, pauseAfterType);
          return;
        }

        later(tick, typeSpeed);
        return;
      }

      // deleting
      charIndex--;
      typedText.textContent = current.slice(0, Math.max(0, charIndex));

      if (charIndex <= 0) {
        deleting = false;
        wordIndex++;
        later(tick, pauseAfterDelete);
        return;
      }

      later(tick, deleteSpeed);
    }

    // Start sequence
    later(() => {
      punct.textContent = ",";
      wrap.classList.remove("hidden");
      later(tick, 450);
    }, initialPeriodHold);
  }

  function initAll() {
    initTheme();
    initActiveNav();
    initYear();
    initTypingHeadline();
  }

  // Normal load
  document.addEventListener("DOMContentLoaded", initAll);

  // Fix bfcache: About -> Back to Home, etc.
  window.addEventListener("pageshow", () => {
    initAll();
  });
})();
