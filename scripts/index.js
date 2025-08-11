document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".video-card").forEach((card) => {
    const playBtn = card.querySelector(".play-btn");
    const thumbnail = card.querySelector(".video-thumbnail");
    const iframe = card.querySelector(".video-iframe");
    const url = card.dataset.url; // embed URL for this card

    if (!playBtn || !thumbnail || !iframe || !url) return;

    const play = () => {
      thumbnail.classList.add("hidden");
      playBtn.classList.add("hidden");
      iframe.src = url;
      iframe.classList.remove("hidden");
    };

    playBtn.addEventListener("click", play);
    thumbnail.addEventListener("click", play);
  });
});

// small interactive helpers
document.getElementById("year").textContent = new Date().getFullYear();

// contact form handler (demo)
function handleForm(e) {
  e.preventDefault();
  const f = e.target;
  // This demo shows a mailto fallback. In production wire this to server or email service.
  const name = encodeURIComponent(f.name.value.trim());
  const email = encodeURIComponent(f.email.value.trim());
  const message = encodeURIComponent(f.message.value.trim());
  const subject = encodeURIComponent(
    "Website inquiry from " + (f.name.value || "Visitor")
  );
  const body = encodeURIComponent(
    `Name: ${f.name.value}\nEmail: ${f.email.value}\n\n${f.message.value}`
  );
  window.location.href = `mailto:mandip.subedi@gmail.com?subject=${subject}&body=${body}`;
}
