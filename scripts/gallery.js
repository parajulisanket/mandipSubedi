(function () {
  const tabs = document.querySelectorAll("#galleryTabs .tab-btn");
  const items = Array.from(
    document.querySelectorAll("#galleryGrid .gallery-item")
  );
  const pager = document.getElementById("galleryPagination");

  const PER_PAGE = 9;
  let currentFilter = "all";
  let currentPage = 1;
  let filtered = items;

  function setActive(btn) {
    tabs.forEach((b) => {
      b.classList.remove("active", "bg-sky-600", "text-white");
      b.classList.add("bg-slate-100");
    });
    btn.classList.add("active", "bg-sky-600", "text-white");
    btn.classList.remove("bg-slate-100");
  }

  function applyFilter(filter) {
    currentFilter = filter;
    currentPage = 1;
    filtered = items.filter((el) => {
      const cat = (el.getAttribute("data-cat") || "").toLowerCase();
      return filter === "all" || cat === filter;
    });
    render();
  }

  function showPage(page) {
    currentPage = page;
    render();
  }

  function render() {
    items.forEach((el) => el.classList.add("hidden"));
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageItems = filtered.slice(start, end);
    pageItems.forEach((el) => el.classList.remove("hidden"));
    buildPagination();
  }

  function buildPagination() {
    pager.innerHTML = "";
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (totalPages <= 1) return;

    const mkBtn = (
      label,
      page,
      isActive = false,
      disabled = false,
      type = "number"
    ) => {
      const btn = document.createElement("button");
      btn.type = "button";

      // Base styles
      btn.className = "flex items-center justify-center mx-1";
      btn.style.minWidth = "44px";
      btn.style.height = "44px";
      btn.style.borderRadius = "9999px";
      btn.style.fontSize = "16px";
      btn.style.lineHeight = "1";

      if (type === "chevron") {
        btn.innerHTML = label; // pass in "‹" or "›"
        btn.style.background = "#eef2f7";
        btn.style.color = "#334155";
      } else {
        btn.innerHTML = label;
        if (isActive) {
          btn.style.background = "#f59e0b"; // amber-500
          btn.style.color = "#fff";
        } else {
          btn.style.background = "transparent";
          btn.style.color = "#334155";
        }
      }

      if (disabled) {
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
      } else {
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => showPage(page));
      }
      return btn;
    };

    // Prev chevron
    pager.appendChild(
      mkBtn(
        '<i class="fas fa-chevron-left"></i>',
        Math.max(1, currentPage - 1),
        false,
        currentPage === 1
      )
    );

    const total = Math.ceil(filtered.length / PER_PAGE);
    const pages = new Set(
      [1, total, currentPage - 1, currentPage, currentPage + 1].filter(
        (p) => p >= 1 && p <= total
      )
    );

    let lastRendered = 0;
    Array.from(pages)
      .sort((a, b) => a - b)
      .forEach((p) => {
        if (p - lastRendered > 1) {
          const dots = document.createElement("span");
          dots.textContent = "…";
          dots.style.padding = "0 8px";
          dots.style.color = "#64748b"; // slate-500
          pager.appendChild(dots);
        }
        pager.appendChild(mkBtn(String(p), p, p === currentPage));
        lastRendered = p;
      });

    // Next chevron
    pager.appendChild(
      mkBtn(
        '<i class="fas fa-chevron-right"></i>',
        Math.min(total, currentPage + 1),
        false,
        currentPage === total
      )
    );
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = (btn.getAttribute("data-filter") || "all").toLowerCase();
      setActive(btn);
      applyFilter(filter);
    });
  });

  const initialActive =
    Array.from(tabs).find((b) => b.classList.contains("active")) || tabs[0];
  if (initialActive) setActive(initialActive);
  applyFilter(
    (initialActive?.getAttribute("data-filter") || "all").toLowerCase()
  );
})();
