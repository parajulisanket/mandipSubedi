function setMaxHeight(el, expanded) {
  if (expanded) {
    el.style.maxHeight = el.scrollHeight + "px";
  } else {
    el.style.maxHeight = "0px";
  }
}

document.querySelectorAll(".collapsible-card").forEach((card) => {
  const btn = card.querySelector(".toggle-btn");
  const body = card.querySelector(".collapsible-body");
  const plus = card.querySelector(".icon-plus");
  const minus = card.querySelector(".icon-minus");

  btn.setAttribute("aria-expanded", "false");
  setMaxHeight(body, false);

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;

    btn.setAttribute("aria-expanded", String(nextExpanded));
    setMaxHeight(body, nextExpanded);

    if (nextExpanded) {
      plus.classList.add("hidden");
      minus.classList.remove("hidden");
      btn.setAttribute("aria-label", "Collapse details");
    } else {
      minus.classList.add("hidden");
      plus.classList.remove("hidden");
      btn.setAttribute("aria-label", "Expand details");
    }
  });

  const ro = new ResizeObserver(() => {
    if (btn.getAttribute("aria-expanded") === "true") {
      body.style.maxHeight = body.scrollHeight + "px";
    }
  });
  ro.observe(body);
});
