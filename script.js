function scrollToPage(pageId) {
  const element = document.getElementById(pageId);
  element.scrollIntoView({ behavior: 'smooth' });
}

function downloadFile() {
  const link = document.createElement('a');
  link.href = 'file.zip';
  link.download = 'zov.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const carouselInner = document.getElementById('carouselInner');
const carouselBtns = document.querySelectorAll('.carousel-btn');
let currentIndex = 0;

function updateCarousel() {
  carouselInner.style.transform = `translateX(-${currentIndex * 33.333}%)`;
  
  carouselBtns.forEach((btn, index) => {
    if (index === currentIndex) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

carouselBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentIndex = parseInt(btn.getAttribute('data-index'));
    updateCarousel();
  });
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % 3;
  updateCarousel();
}, 5000);

const stickyHeader = document.getElementById('stickyHeader');
const mainPage = document.getElementById('mainPage');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        stickyHeader.classList.add('visible');
      } else {
        stickyHeader.classList.remove('visible');
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '-50px 0px 0px 0px'
  }
);

observer.observe(mainPage);

const videoElement = document.getElementById('videoElement');
const videoPreview = document.getElementById('videoPreview');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');

let isTransitioning = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTime() {
  currentTimeEl.textContent = formatTime(videoElement.currentTime);
}

function updateDuration() {
  durationTimeEl.textContent = formatTime(videoElement.duration);
}

function startVideo() {
  if (isTransitioning) return;
  isTransitioning = true;
  
  videoPreview.classList.add('hidden');
  
  setTimeout(() => {
    videoElement.classList.add('playing');
    videoElement.play();
    playIcon.className = 'fa-solid fa-pause';
    isTransitioning = false;
  }, 400);
}

function stopVideo() {
  if (isTransitioning) return;
  isTransitioning = true;
  
  videoElement.pause();
  playIcon.className = 'fa-solid fa-play';
  
  videoElement.classList.remove('playing');
  
  setTimeout(() => {
    videoPreview.classList.remove('hidden');
    isTransitioning = false;
  }, 400);
}

playPauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (videoElement.paused) {
    startVideo();
  } else {
    stopVideo();
  }
});

videoPreview.addEventListener('click', () => {
  startVideo();
});

videoElement.addEventListener('click', () => {
  stopVideo();
});

muteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  videoElement.muted = !videoElement.muted;
  if (videoElement.muted) {
    volumeIcon.className = 'fa-solid fa-volume-xmark';
  } else {
    volumeIcon.className = 'fa-solid fa-volume-high';
  }
});

videoElement.addEventListener('timeupdate', updateTime);

videoElement.addEventListener('loadedmetadata', () => {
  updateDuration();
  updateTime();
});

videoElement.addEventListener('ended', () => {
  stopVideo();
  videoElement.currentTime = 0;
});

videoElement.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

videoPreview.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

videoElement.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    if (videoElement.paused) {
      startVideo();
    } else {
      stopVideo();
    }
  } else if (['ArrowLeft', 'ArrowRight', 'm', 'M'].includes(e.key)) {
    if (e.key.toLowerCase() === 'm') {
      e.preventDefault();
      videoElement.muted = !videoElement.muted;
      if (videoElement.muted) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
      } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
      }
    } else {
      e.preventDefault();
    }
  } else {
    e.preventDefault();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  updateTime();
  videoElement.muted = true;
  volumeIcon.className = 'fa-solid fa-volume-xmark';
  
  videoElement.classList.remove('playing');
  videoPreview.classList.remove('hidden');
});