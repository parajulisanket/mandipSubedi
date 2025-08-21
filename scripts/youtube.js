const API_KEY = "AIzaSyD-ijo7d4kBhCLRpvTe1Z0MWQ-mEtMTB4k";
const channelId = "UCKT9tBWER3FKFzQNwbHmHdA";
const maxResults = 10;

const mainPlayer = document.getElementById("main-player");
const videoTitle = document.getElementById("video-title");
const videoViews = document.getElementById("video-views");
const videoDate = document.getElementById("video-date");
const channelImg = document.getElementById("channel-img");
const channelName = document.getElementById("channel-name");
const channelSubs = document.getElementById("channel-subs");
const videoList = document.getElementById("video-list");

// manual video
const MANUAL_VIDEO = {
  id: { kind: "youtube#video", videoId: "wew7eD6dLiM" },
  snippet: {
    title:
      "Visionary behind Geomandu & Premier Engineering College ft. Dr. Mandip Subedi ",
    thumbnails: {
      medium: { url: "./images/videothum.png" },
    },
  },
};

async function fetchVideos() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`
    );
    const data = await res.json();

    if (!data.items || !Array.isArray(data.items)) {
      console.error("Error: data.items is missing or not an array", data);
      // Fallback: show manual video only if API fails
      if (MANUAL_VIDEO?.id?.videoId) {
        loadMainVideo(MANUAL_VIDEO);
        createVideoItem(MANUAL_VIDEO);
      }
      return;
    }

    const apiVideos = data.items.filter(
      (item) => item.id.kind === "youtube#video"
    );

    // Put manual first and remove duplicate if same ID exists in the API list
    const manualId = MANUAL_VIDEO?.id?.videoId;
    const deduped = apiVideos.filter((v) => v?.id?.videoId !== manualId);
    const videos = manualId ? [MANUAL_VIDEO, ...deduped] : deduped;

    if (videos.length > 0) {
      loadMainVideo(videos[0]); // manual video loads first
      videos.forEach((video) => createVideoItem(video));
    }
  } catch (err) {
    console.error("YouTube fetch error:", err);
    // Fallback: render manual if fetch errored
    if (MANUAL_VIDEO?.id?.videoId) {
      loadMainVideo(MANUAL_VIDEO);
      createVideoItem(MANUAL_VIDEO);
    }
  }
}

// main video load
function loadMainVideo(video) {
  const id = video?.id?.videoId || video?.id;
  if (!id) return;

  mainPlayer.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  videoTitle.textContent = video?.snippet?.title || "Untitled Video";

  // Fetch stats and channel data for the selected video
  fetchVideoDetails(id);

  // Optional: highlight active in the sidebar
  if (videoList) {
    [...videoList.querySelectorAll("[data-video-id]")].forEach((el) => {
      el.classList.remove("ring-2", "ring-sky-500", "bg-white");
    });
    const active = videoList.querySelector(`[data-video-id="${id}"]`);
    if (active) active.classList.add("ring-2", "ring-sky-500", "bg-white");
  }
}

async function fetchVideoDetails(videoId) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=statistics,snippet`
    );
    const data = await res.json();
    const video = data?.items?.[0];
    if (!video) return;

    if (videoViews) {
      videoViews.textContent = `${Number(
        video.statistics.viewCount || 0
      ).toLocaleString()} views`;
    }
    if (videoDate) {
      videoDate.textContent = new Date(
        video.snippet.publishedAt
      ).toLocaleDateString();
    }

    fetchChannelDetails(video.snippet.channelId);
  } catch (err) {
    console.error("fetchVideoDetails error:", err);
  }
}

async function fetchChannelDetails(cid) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${cid}&part=snippet,statistics`
    );
    const data = await res.json();
    const channel = data?.items?.[0];
    if (!channel) return;

    if (channelImg) channelImg.src = channel.snippet.thumbnails.default.url;
    if (channelName) channelName.textContent = channel.snippet.title;
    if (channelSubs) {
      channelSubs.textContent = `${Number(
        channel.statistics.subscriberCount || 0
      ).toLocaleString()} subscribers`;
    }
  } catch (err) {
    console.error("fetchChannelDetails error:", err);
  }
}

// side bar
function createVideoItem(video) {
  const id = video?.id?.videoId || video?.id;
  const thumb =
    video?.snippet?.thumbnails?.medium?.url ||
    (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "");
  const isManual = id === MANUAL_VIDEO?.id?.videoId;

  const div = document.createElement("div");
  div.setAttribute("data-video-id", id);
  div.className =
    "flex gap-3 items-start w-full bg-white rounded-md shadow-sm p-3 hover:shadow-md transition duration-200 cursor-pointer";

  div.innerHTML = `
    <img src="${thumb}" alt="Thumbnail" class="w-28 h-20 object-cover rounded" />
    <div class="flex-1">
      <h4 class="text-gray-800 font-medium text-sm md:text-base leading-snug line-clamp-2">
        ${video?.snippet?.title || "Video"}
      </h4>
      ${isManual ? `` : ""}
    </div>
  `;

  div.addEventListener("click", () => loadMainVideo(video));
  videoList.appendChild(div);
}

function parseISO8601Duration(iso) {
  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || 0, 10);
  const seconds = parseInt(match?.[2] || 0, 10);
  return minutes * 60 + seconds;
}

function loadShorts(shorts) {
  const container = document.getElementById("shorts-slider");
  if (!container) return;
  shorts.forEach((video) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide shorts-item";
    slide.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&playsinline=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      <p>${video.snippet.title}</p>`;
    container.appendChild(slide);
  });
}

fetchVideos();
