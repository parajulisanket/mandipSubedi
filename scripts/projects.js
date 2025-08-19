(function () {
  const btns = document.querySelectorAll('#projects [role="tab"]');
  const panels = {
    roads: document.getElementById("tab-roads"),
    bridges: document.getElementById("tab-bridges"),
    visits: document.getElementById("tab-visits"),
  };

  function activate(key) {
    btns.forEach((b) => {
      const on = b.dataset.tab === key;
      b.setAttribute("aria-selected", on ? "true" : "false");

      b.classList.toggle("bg-sky-600", on);
      b.classList.toggle("text-white", on);

      b.classList.toggle("bg-slate-100", !on);
      b.classList.toggle("text-slate-700", !on);
    });

    Object.entries(panels).forEach(([k, el]) => {
      el.classList.toggle("hidden", k !== key);
    });
  }

  btns.forEach((b) =>
    b.addEventListener("click", () => activate(b.dataset.tab))
  );
  // default: roads
  activate("roads");
})();
