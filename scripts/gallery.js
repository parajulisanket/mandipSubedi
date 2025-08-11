// ./scripts/gallery.js
document.addEventListener("DOMContentLoaded", () => {
  // 0) Find gallery items
  const selector = '[data-fancybox="gallery"]';
  let items = Array.from(document.querySelectorAll(selector));

  if (!items.length) {
    console.warn("[gallery] No gallery items found for", selector);
    return;
  }

  // 1) Verify Fancybox loaded
  if (typeof Fancybox === "undefined") {
    console.error(
      "[gallery] Fancybox not loaded. Ensure the CDN script is included BEFORE this file."
    );
    return;
  }

  // 2) Remove invalid/broken hrefs so Fancybox won’t choke
  items = items.filter((a) => {
    const href = a.getAttribute("href") || "";
    const ok =
      href &&
      href !== "#" &&
      !href.startsWith("javascript:") &&
      // crude image check (optional)
      /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(href);

    if (!ok) {
      console.warn("[gallery] Skipping invalid href:", href, a);
      a.removeAttribute("data-fancybox");
    } else {
      // Make sure clicks aren’t blocked by overlays
      a.classList.add("relative", "z-10");
    }
    return ok;
  });

  // 3) Re-bind only if valid items remain
  if (!items.length) {
    console.warn("[gallery] No valid gallery items after filtering.");
    return;
  }

  // 4) Bind Fancybox
  Fancybox.bind(selector, {
    Thumbs: { type: "classic" }, // thumbnail strip
    Toolbar: {
      display: {
        left: ["infobar"], // "2 / 6"
        middle: [],
        right: ["slideshow", "fullscreen", "thumbs", "close"],
      },
    },
    Images: { zoom: true },
    Carousel: { friction: 0.9 },
    dragToClose: true,
    animated: true,
  });

  // 5) Optional: Preload images for snappier first open
  items.forEach((a) => {
    const href = a.getAttribute("href");
    if (href) {
      const img = new Image();
      img.src = href;
    }
  });

  // Debug (optional)
  console.log("[gallery] Fancybox bound to", items.length, "items");
});
