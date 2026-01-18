(function () {
  const root = document.documentElement;

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

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".links a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Typing headline (home only)
  const typedText = document.getElementById("typedText");
  const typedContainer = document.getElementById("typedContainer");
  const cursor = document.getElementById("typedCursor");
  const finalDot = document.getElementById("finalDot");

  if (typedText && typedContainer && cursor && finalDot) {
    finalDot.classList.add("hidden"); // hide dot while typing

    const words = ["a student?", "a gamer?", "a researcher?"];

    const typeSpeed = 70;      // ms per char
    const deleteSpeed = 45;    // ms per char
    const pauseAfterType = 800;
    const pauseAfterDelete = 250;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = words[wordIndex];

      if (!deleting) {
        // typing
        charIndex++;
        typedText.textContent = current.slice(0, charIndex);

        if (charIndex >= current.length) {
          // pause, then start deleting
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
        // move to next word or finish
        deleting = false;
        wordIndex++;

        if (wordIndex >= words.length) {
          // finish: remove suffix, show dot, stop
          typedContainer.classList.add("hidden");
          finalDot.classList.remove("hidden");
          return;
        }

        setTimeout(tick, pauseAfterDelete);
        return;
      }

      setTimeout(tick, deleteSpeed);
    };

    // start
    setTimeout(tick, 350);
  }
})();
