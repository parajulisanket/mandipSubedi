// simple testimonial carousel (horizontal slide)

document.addEventListener("DOMContentLoaded", () => {
  const prev = document.getElementById("prevTestimonial");
  const next = document.getElementById("nextTestimonial");
  const viewport = document.getElementById("testimonialCarousel");

  // The track is the FIRST child <div> inside #testimonialCarousel
  const track = viewport.firstElementChild;
  const slides = track.children;

  let index = 0;

  const perView = () => (window.innerWidth >= 768 ? 2 : 1); // md breakpoint

  // Compute a single "step" (one card width + its right margin)
  function stepPx() {
    if (!slides.length) return 0;
    const s = slides[0];
    const styles = getComputedStyle(s);
    const mr = parseFloat(styles.marginRight) || 0;
    // offsetWidth includes padding and border (not margin) — add margin-right manually.
    return s.offsetWidth + mr;
  }

  function maxIndex() {
    return Math.max(0, slides.length - perView());
  }

  function render() {
    track.style.transform = `translateX(${-index * stepPx()}px)`;
  }

  function go(newIndex) {
    const max = maxIndex();
    if (newIndex < 0) newIndex = max; // wrap to end
    if (newIndex > max) newIndex = 0; // wrap to start
    index = newIndex;
    render();
  }

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));

  // Recalculate on resize (layout changes, md breakpoint crossovers)
  let ro;
  if ("ResizeObserver" in window) {
    ro = new ResizeObserver(() => render());
    ro.observe(viewport);
    Array.from(slides).forEach((s) => ro.observe(s));
  } else {
    window.addEventListener("resize", render);
  }

  // Initial paint
  render();
});
