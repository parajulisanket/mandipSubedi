const itemsPerPage = 4;
const list = document.getElementById("publication-list");
const controls = document.getElementById("pagination-controls");
const exploreMore = document.getElementById("explore-more");

if (!list || !controls) {
  console.warn("Pagination: required elements not found.");
} else {
  const items = Array.from(list.querySelectorAll("li"));
  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;

  let currentPage = 1;

  function showPage(page) {
    currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    items.forEach((item, index) => {
      item.style.display = index >= start && index < end ? "" : "none";
    });

    if (exploreMore) {
      exploreMore.classList.toggle("hidden", currentPage !== totalPages);
    }

    renderControls();
  }

  function renderControls() {
    if (totalPages <= 1) {
      controls.classList.add("hidden");
      return;
    } else {
      controls.classList.remove("hidden");
    }

    controls.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left text-sm"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.className =
      "px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50";
    prevBtn.onclick = () => showPage(currentPage - 1);
    controls.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `px-3 py-1 rounded-full ${
        i === currentPage
          ? "bg-amber-500 text-white text-sm"
          : "text-gray-700 text-sm hover:bg-gray-100"
      }`;
      btn.onclick = () => showPage(i);
      controls.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right text-sm"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className =
      "px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50";
    nextBtn.onclick = () => showPage(currentPage + 1);
    controls.appendChild(nextBtn);
  }

  showPage(1);
}
