document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // Theme
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
    });
  }

  // Active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".links a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Typing headline (home only)
  const punct = document.getElementById("punct");
  const wrap = document.getElementById("typedWrap");
  const typedText = document.getElementById("typedText");
  const cursor = document.getElementById("typedCursor");

  if (!punct || !wrap || !typedText || !cursor) return;

  // Your sequence (ends on "a learner." and stops)
  const words = ["...a student?", "...a gamer?", "...a researcher?", "a learner."];

  // Slower pacing
  const typeSpeed = 140;       // ms per char
  const deleteSpeed = 95;      // ms per char
  const pauseAfterType = 1200; // after a full word typed
  const pauseAfterDelete = 500;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const finish = () => {
    // stop with final text visible and cursor hidden
    setTimeout(() => cursor.classList.add("hidden"), 700);
  };

  const tick = () => {
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
        setTimeout(tick, pauseAfterType);
        return;
      }

      setTimeout(tick, typeSpeed);
      return;
    }

    // deleting
    charIndex--;
    typedText.textContent = current.slice(0, Math.max(0, charIndex));

    if (charIndex <= 0) {
      deleting = false;
      wordIndex++;
      setTimeout(tick, pauseAfterDelete);
      return;
    }

    setTimeout(tick, deleteSpeed);
  };

  // Start: show "Hi, I'm Pranit." then edit "." -> "," then type suffix
  setTimeout(() => {
    punct.textContent = ",";
    wrap.classList.remove("hidden");
    setTimeout(tick, 450);
  }, 1600);
});
