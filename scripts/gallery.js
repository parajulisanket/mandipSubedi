(function () {
  const tabs = document.querySelectorAll("#galleryTabs .tab-btn");
  const items = document.querySelectorAll("#galleryGrid .gallery-item");

  function setActive(btn) {
    tabs.forEach((b) => {
      b.classList.remove("active", "bg-sky-600", "text-white");
      b.classList.add("bg-slate-100");
    });
    btn.classList.add("active", "bg-sky-600", "text-white");
    btn.classList.remove("bg-slate-100");
  }

  function filterGallery(filter) {
    items.forEach((el) => {
      const cat = (el.getAttribute("data-cat") || "").toLowerCase();
      const show = filter === "all" || cat === filter;
      el.classList.toggle("hidden", !show);
    });
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      setActive(btn);
      filterGallery(filter);
    });
  });

  // default state
  filterGallery("all");
})();
