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

async function fetchVideos() {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`
  );
  const data = await res.json();

  if (!data.items || !Array.isArray(data.items)) {
    console.error("Error: data.items is missing or not an array", data);
    return;
  }

  const videos = data.items.filter((item) => item.id.kind === "youtube#video");

  if (videos.length > 0) {
    loadMainVideo(videos[0]);
    videos.forEach((video) => createVideoItem(video));
  }
}

function loadMainVideo(video) {
  mainPlayer.src = `https://www.youtube.com/embed/${video.id.videoId}?autoplay=1`;
  videoTitle.textContent = video.snippet.title;
  fetchVideoDetails(video.id.videoId);
}

async function fetchVideoDetails(videoId) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=statistics,snippet`
  );
  const data = await res.json();
  const video = data.items[0];

  videoViews.textContent = `${Number(
    video.statistics.viewCount
  ).toLocaleString()} views`;
  videoDate.textContent = new Date(
    video.snippet.publishedAt
  ).toLocaleDateString();
  fetchChannelDetails(video.snippet.channelId);
}

async function fetchChannelDetails(channelId) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelId}&part=snippet,statistics`
  );
  const data = await res.json();
  const channel = data.items[0];

  channelImg.src = channel.snippet.thumbnails.default.url;
  channelName.textContent = channel.snippet.title;
  channelSubs.textContent = `${Number(
    channel.statistics.subscriberCount
  ).toLocaleString()} subscribers`;
}

function createVideoItem(video) {
  const div = document.createElement("div");

  div.className =
    "flex gap-3 items-start w-full bg-white rounded-md shadow-sm p-3 hover:shadow-md transition duration-200 cursor-pointer";

  div.innerHTML = `
    <img src="${video.snippet.thumbnails.medium.url}" alt="Thumbnail"
      class="w-28 h-20 object-cover " />
    <h4 class="text-gray-800 font-medium text-sm md:text-base leading-snug line-clamp-2">
      ${video.snippet.title}
    </h4>
  `;

  div.addEventListener("click", () => {
    loadMainVideo(video);
  });

  videoList.appendChild(div);
}

function parseISO8601Duration(iso) {
  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || 0);
  const seconds = parseInt(match?.[2] || 0);
  return minutes * 60 + seconds;
}

function loadShorts(shorts) {
  const container = document.getElementById("shorts-slider");
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
