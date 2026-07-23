const CONFIG = {
  name: "Trần Bá Hiếu",
  role: "Student & Developer",
  bio: "Yêu thích lập trình và thiết kế website.",
  social: [
    { label: "Facebook", caption: "Kết nối ngay", href: "https://www.facebook.com/HjeuDepZaiii", icon: "facebook" },
    { label: "TikTok", caption: "Video ngắn", href: "https://www.tiktok.com/@hieudepzaii_63", icon: "tiktok" },
    { label: "Telegram", caption: "Nhắn tin", href: "https://t.me/HjeuDepZaii63", icon: "telegram" },
    { label: "Instagram", caption: "Ảnh đẹp", href: "https://www.instagram.com/hjeudepzaiii", icon: "instagram" },
  ],
  gallery: [
    { src: "gallery-1.jpg", title: "Gallery 1", caption: "Ảnh 01" },
    { src: "gallery-2.jpg", title: "Gallery 2", caption: "Ảnh 02" },
    { src: "gallery-3.jpg", title: "Gallery 3", caption: "Ảnh 03" },
    { src: "gallery-4.jpg", title: "Gallery 4", caption: "Ảnh 04" },
  ],
  music: {
    title: "China Pipa x Gong Xi Thazh",
    artist: "Trần Bá Hiếu",
    file: "music.mp3",
    cover: "albums.jpg",
  },
  donate: {
    bank: "MB Bank",
    owner: "TRAN BA HIEU",
    account: "123456789990",
    qr: "qr-bank.jpg",
  },
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const els = {
  loader: $('#loader'),
  menuButton: $('#menuButton'),
  siteNav: $('#siteNav'),
  year: $('#year'),
  heroName: $('#heroName'),
  heroBio: $('#heroBio'),
  socialGrid: $('#socialGrid'),
  galleryGrid: $('#galleryGrid'),
  musicCover: $('#musicCover'),
  trackTitle: $('#trackTitle'),
  trackArtist: $('#trackArtist'),
  audio: $('#audio'),
  playBtn: $('#playBtn'),
  loopBtn: $('#loopBtn'),
  muteBtn: $('#muteBtn'),
  progress: $('#progress'),
  currentTime: $('#currentTime'),
  duration: $('#duration'),
  volume: $('#volume'),
  bankOwner: $('#bankOwner'),
  accountNumber: $('#accountNumber'),
  copyAccount: $('#copyAccount'),
  donateQR: $('.donate-qr img'),
  lightbox: $('#lightbox'),
  lightboxImage: $('#lightboxImage'),
  lightboxCaption: $('#lightboxCaption'),
  lightboxCounter: $('#lightboxCounter'),
  lightboxClose: $('#lightboxClose'),
  lightboxPrev: $('#lightboxPrev'),
  lightboxNext: $('#lightboxNext'),
  toast: $('#toast'),
  backToTop: $('#backToTop'),
  reveal: $$('.reveal'),
};

const state = {
  index: 0,
  looping: false,
  muted: false,
  toastTimer: 0,
  hideLoaderTimer: 0,
  scrollTicking: false,
};

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('is-show');
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => els.toast.classList.remove('is-show'), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Đã sao chép số tài khoản');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast('Đã sao chép số tài khoản');
  }
}

function renderSocials() {
  els.socialGrid.innerHTML = CONFIG.social.map((item) => `
    <a class="social-pill reveal" href="${item.href}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">
      <span class="social-icon"><svg class="ui-icon" aria-hidden="true"><use href="#icon-${item.icon}"></use></svg></span>
      <span class="social-copy">
        <strong>${item.label}</strong>
        <small>${item.caption}</small>
      </span>
    </a>
  `).join('');
}

function renderGallery() {
  els.galleryGrid.innerHTML = CONFIG.gallery.map((item, index) => `
    <button class="gallery-item reveal" type="button" data-index="${index}" aria-label="${item.title}">
      <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async">
      <span class="gallery-label">
        <strong>${item.title}</strong>
        <small>${item.caption}</small>
      </span>
    </button>
  `).join('');
}

function preloadImages() {
  [CONFIG.music.cover, ...CONFIG.gallery.map((item) => item.src)].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function openLightbox(index) {
  const item = CONFIG.gallery[index];
  if (!item) return;
  state.index = index;
  els.lightboxImage.src = item.src;
  els.lightboxImage.alt = item.title;
  els.lightboxCaption.textContent = item.caption;
  els.lightboxCounter.textContent = `${index + 1} / ${CONFIG.gallery.length}`;
  els.lightbox.classList.add('is-open');
  els.lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  els.lightbox.classList.remove('is-open');
  els.lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function nextImage() {
  openLightbox((state.index + 1) % CONFIG.gallery.length);
}

function previousImage() {
  openLightbox((state.index - 1 + CONFIG.gallery.length) % CONFIG.gallery.length);
}

function renderContent() {
  document.title = `HieuDev | ${CONFIG.name}`;
  document.querySelector('meta[name="description"]').setAttribute('content', `${CONFIG.name} — ${CONFIG.role}`);
  els.heroName.textContent = CONFIG.name;
  els.heroBio.textContent = CONFIG.bio;
  els.trackTitle.textContent = CONFIG.music.title;
  els.trackArtist.textContent = CONFIG.music.artist;
  els.musicCover.src = CONFIG.music.cover;
  els.donateQR.src = CONFIG.donate.qr;
  els.bankOwner.textContent = CONFIG.donate.owner;
  els.accountNumber.textContent = CONFIG.donate.account;
  els.year.textContent = new Date().getFullYear();
  els.audio.src = CONFIG.music.file;
  els.audio.preload = 'metadata';
}

function setMusicState(playing) {
  els.playBtn.classList.toggle('is-playing', playing);
  els.playBtn.setAttribute('aria-label', playing ? 'Tạm dừng nhạc' : 'Phát nhạc');
}

function setLoopState(value) {
  state.looping = value;
  els.loopBtn.classList.toggle('is-active', value);
  els.loopBtn.setAttribute('aria-pressed', String(value));
  els.audio.loop = value;
}

function setMuteState(value) {
  state.muted = value;
  els.audio.muted = value;
  els.muteBtn.classList.toggle('is-active', value);
  els.muteBtn.setAttribute('aria-pressed', String(value));
}

function initAudio() {
  const savedVolume = Number(localStorage.getItem('hdev-volume'));
  const savedLoop = localStorage.getItem('hdev-loop') === '1';
  const savedMute = localStorage.getItem('hdev-mute') === '1';

  els.audio.volume = Number.isFinite(savedVolume) && savedVolume > 0 ? savedVolume : 0.82;
  els.volume.value = els.audio.volume;
  setLoopState(savedLoop);
  setMuteState(savedMute);

  els.audio.addEventListener('loadedmetadata', () => {
    els.duration.textContent = formatTime(els.audio.duration);
    els.progress.max = Math.floor(els.audio.duration || 0);
  });

  els.audio.addEventListener('timeupdate', () => {
    if (!els.audio.duration) return;
    els.progress.value = Math.floor(els.audio.currentTime);
    els.currentTime.textContent = formatTime(els.audio.currentTime);
  });

  els.audio.addEventListener('play', () => setMusicState(true));
  els.audio.addEventListener('pause', () => setMusicState(false));
  els.audio.addEventListener('ended', () => {
    if (!state.looping) setMusicState(false);
  });

  els.playBtn.addEventListener('click', async () => {
    if (els.audio.paused) {
      try {
        await els.audio.play();
      } catch {
        showToast('Không thể phát nhạc');
      }
    } else {
      els.audio.pause();
    }
  });

  els.loopBtn.addEventListener('click', () => {
    setLoopState(!state.looping);
    localStorage.setItem('hdev-loop', state.looping ? '1' : '0');
  });

  els.muteBtn.addEventListener('click', () => {
    setMuteState(!state.muted);
    localStorage.setItem('hdev-mute', state.muted ? '1' : '0');
    showToast(state.muted ? 'Đã tắt tiếng' : 'Đã bật tiếng');
  });

  els.volume.addEventListener('input', () => {
    const value = Number(els.volume.value);
    els.audio.volume = value;
    localStorage.setItem('hdev-volume', String(value));
    if (value === 0) {
      setMuteState(true);
      localStorage.setItem('hdev-mute', '1');
    } else if (state.muted) {
      setMuteState(false);
      localStorage.setItem('hdev-mute', '0');
    }
  });

  els.progress.addEventListener('input', () => {
    els.audio.currentTime = Number(els.progress.value);
  });
}

function initSocials() {
  renderSocials();
  $('#socialGrid').addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    if (window.innerWidth <= 920) closeMobileNav();
  });
}

function initGallery() {
  renderGallery();
  preloadImages();
  els.galleryGrid.addEventListener('click', (event) => {
    const btn = event.target.closest('.gallery-item');
    if (!btn) return;
    openLightbox(Number(btn.dataset.index));
  });

  els.lightboxClose.addEventListener('click', closeLightbox);
  els.lightboxPrev.addEventListener('click', previousImage);
  els.lightboxNext.addEventListener('click', nextImage);
  els.lightbox.addEventListener('click', (event) => {
    if (event.target === els.lightbox) closeLightbox();
  });

  let touchStartX = 0;
  let touchEndX = 0;
  const frame = $('.lightbox-frame');
  frame.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  frame.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 54) {
      diff > 0 ? nextImage() : previousImage();
    }
  }, { passive: true });
}

function initNav() {
  const closeMobileNav = () => {
    els.siteNav.classList.remove('is-open');
    els.menuButton.setAttribute('aria-expanded', 'false');
  };
  window.closeMobileNav = closeMobileNav;

  els.menuButton.addEventListener('click', () => {
    const open = els.siteNav.classList.toggle('is-open');
    els.menuButton.setAttribute('aria-expanded', String(open));
  });

  $$('#siteNav a').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      if (window.innerWidth <= 920) closeMobileNav();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMobileNav();
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  $$('.reveal').forEach((el) => observer.observe(el));
}

function initTopTools() {
  els.copyAccount.addEventListener('click', () => copyText(CONFIG.donate.account));
  window.addEventListener('scroll', () => {
    if (state.scrollTicking) return;
    state.scrollTicking = true;
    requestAnimationFrame(() => {
      const show = window.scrollY > 520;
      els.backToTop.classList.toggle('is-visible', show);
      state.scrollTicking = false;
    });
  }, { passive: true });

  els.backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
      window.closeMobileNav?.();
    }
    if (!els.lightbox.classList.contains('is-open')) return;
    if (event.key === 'ArrowRight') nextImage();
    if (event.key === 'ArrowLeft') previousImage();
  });
}

function hideLoader() {
  window.clearTimeout(state.hideLoaderTimer);
  state.hideLoaderTimer = window.setTimeout(() => {
    els.loader.classList.add('is-hidden');
  }, 650);
}

function init() {
  renderContent();
  initNav();
  initSocials();
  initGallery();
  initAudio();
  initReveal();
  initTopTools();
  hideLoader();
}

document.addEventListener('DOMContentLoaded', init);
