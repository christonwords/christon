/* ============================================================= */
/*  Music Player – Main Logic                                    */
/* ============================================================= */

/* Global State ------------------------------------------------- */
let tracks = [];               // Filled from tracks.json
let currentIndex = -1;         // Index in tracks[]
let isShuffling = false;
let isLooping = false;
let shuffledOrder = [];        // Holds shuffled indices
let audio = document.getElementById('audioPlayer');

/* UI References ------------------------------------------------ */
const trackListEl = document.getElementById('trackList');
const newsFeedEl  = document.getElementById('newsFeed');
const memeGridEl  = document.getElementById('memeGrid');
const adCarousel  = document.getElementById('adCarousel');

/* Player UI */
const coverImg    = document.getElementById('coverImg');
const trackTitle  = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');

const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const shuffleBtn   = document.getElementById('shuffleBtn');
const loopBtn      = document.getElementById('loopBtn');
const volumeSlider = document.getElementById('volumeSlider');
const seekBar      = document.getElementById('seekBar');
const currentTimeEl= document.getElementById('currentTime');
const durationEl   = document.getElementById('duration');

/* ------------------------------------------------------------ */
/*  Fetch Data – Tracks, News, Memes, Ads                      */
/* ------------------------------------------------------------ */
async function loadData() {
  try {
    const [tracksRes, newsRes, memesRes, adRes] = await Promise.all([
      fetch('data/tracks.json'),
      fetch('data/news.json'),
      fetch('data/memes.json'),
      fetch('ads/banner.html')
    ]);

    tracks = await tracksRes.json();
    const news = await newsRes.json();
    const memes = await memesRes.json();
    const adHTML = await adRes.text();

    renderTrackList();
    renderNews(news);
    renderMemes(memes);
    renderAds(adHTML);
  } catch (e) {
    console.error('Error loading data:', e);
  }
}

/* ------------------------------------------------------------ */
/*  Render Functions                                            */
/* ------------------------------------------------------------ */

function renderTrackList() {
  trackListEl.innerHTML = ''; // clear
  tracks.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = 'track-card';
    card.dataset.idx = idx;
    card.innerHTML = `
      <div class="track-cover" style="background-image:url('${t.cover}')"></div>
      <div class="track-meta">
        <h3>${t.title}</h3>
        <p>${t.artist}</p>
        <p class="plays">▶ ${t.plays.toLocaleString()} plays</p>
      </div>
    `;
    card.addEventListener('click', () => playTrack(idx));
    trackListEl.appendChild(card);
  });
}

function renderNews(newsArray) {
  newsFeedEl.innerHTML = '';
  newsArray.sort((a,b)=>new Date(b.date)-new Date(a.date))
           .forEach(item => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      <h3>${item.title}</h3>
      <small>${new Date(item.date).toLocaleDateString()}</small>
      <p>${item.body}</p>
    `;
    newsFeedEl.appendChild(div);
  });
}

function renderMemes(memesArray) {
  memeGridEl.innerHTML = '';
  memesArray.forEach(m => {
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.innerHTML = `
      <img src="${m.image}" alt="${m.caption}">
      <div class="caption">${m.caption}</div>
      <div class="plays">▶ ${m.plays.toLocaleString()} plays</div>
    `;
    memeGridEl.appendChild(card);
  });
}

/* Ad carousel (simple auto‑rotate) */
let adSlides = [];
let adCurrent = 0;
function renderAds(htmlContent) {
  adCarousel.innerHTML = htmlContent; // expected multiple .slide divs
  adSlides = adCarousel.querySelectorAll('.slide');
  // initialise first slide
  if (adSlides.length) adSlides[0].classList.add('active');
  // auto‑rotate every 7 s
  setInterval(() => {
    adSlides[adCurrent].classList.remove('active');
    adSlides[adCurrent].classList.add('prev');
    adCurrent = (adCurrent + 1) % adSlides.length;
    adSlides[adCurrent].classList.remove('prev');
    adSlides[adCurrent].classList.add('active');
  }, 7000);
}

/* ------------------------------------------------------------ */
/*  Playback Logic                                              */
/* ------------------------------------------------------------ */

function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  const t = tracks[index];
  currentIndex = index;
  audio.src = t.file;
  audio.play()
       .catch(err => console.warn('Playback issue', err));
  updatePlayerUI(t);
  setActiveCard(index);
}

function updatePlayerUI(t) {
  coverImg.src = t.cover;
  trackTitle.textContent = t.title;
  trackArtist.textContent = t.artist;
  // Reset progress
  seekBar.value = 0;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = t.duration || '0:00';
}

function setActiveCard(idx) {
  const prevActive = document.querySelector('.track-card.active');
  if (prevActive) prevActive.classList.remove('active');
  const newActive = document.querySelector(`.track-card[data-idx="${idx}"]`);
  if (newActive) newActive.classList.add('active');
}

/* Play / Pause toggle */
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

/* Next / Previous */
function playNext() {
  let nextIdx;
  if (isShuffling) {
    nextIdx = shuffledOrder[(shuffledOrder.indexOf(currentIndex) + 1) % shuffledOrder.length];
  } else {
    nextIdx = (currentIndex + 1) % tracks.length;
  }
  playTrack(nextIdx);
}
function playPrev() {
  let prevIdx;
  if (isShuffling) {
    const pos = shuffledOrder.indexOf(currentIndex);
    prevIdx = shuffledOrder[(pos - 1 + shuffledOrder.length) % shuffledOrder.length];
  } else {
    prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
  }
  playTrack(prevIdx);
}

/* Shuffle handling */
function toggleShuffle() {
  isShuffling = !isShuffling;
  shuffleBtn.style.color = isShuffling ? 'var(--clr-primary)' : '';
  if (isShuffling) {
    shuffledOrder = [...Array(tracks.length).keys()];
    for (let i = shuffledOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOrder[i], shuffledOrder[j]] = [shuffledOrder[j], shuffledOrder[i]];
    }
  }
}

/* Loop handling */
function toggleLoop() {
  isLooping = !isLooping;
  loopBtn.style.color = isLooping ? 'var(--clr-primary)' : '';
  audio.loop = isLooping;
}

/* Volume */
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

/* Seek */
seekBar.addEventListener('input', () => {
  const seekTo = (seekBar.value / 100) * audio.duration;
  if (!isNaN(seekTo)) audio.currentTime = seekTo;
});

/* Update progress bar while playing */
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    seekBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

/* When a track ends (if not looping) – auto‑next */
audio.addEventListener('ended', () => {
  if (!isLooping) {
    playNext();
  }
});

/* Helper */
function formatTime(sec) {
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs.toString().padStart(2,'0')}`;
}

/* ------------------------------------------------------------ */
/*  Event Listeners --------------------------------------------- */
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);
shuffleBtn.addEventListener('click', toggleShuffle);
loopBtn.addEventListener('click', toggleLoop);

/* ------------------------------------------------------------ */
/*  Init ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', loadData);
