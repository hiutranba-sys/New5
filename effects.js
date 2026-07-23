const starfield = document.getElementById('starfield');
const meteors = document.getElementById('meteors');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createStars() {
  if (!starfield) return;

  const amount = prefersReducedMotion ? 28 : (window.innerWidth < 700 ? 46 : 92);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < amount; i += 1) {
    const star = document.createElement('span');
    star.className = 'star';
    const size = rand(1, isCoarse ? 2.4 : 2.8);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${rand(0, 100)}vw`;
    star.style.top = `${rand(0, 100)}vh`;
    star.style.opacity = String(rand(0.18, 0.9));
    star.style.setProperty('--twinkle', `${rand(2.8, 5.8)}s`);
    star.style.animationDelay = `${rand(0, 5)}s`;
    fragment.appendChild(star);
  }

  starfield.innerHTML = '';
  starfield.appendChild(fragment);
}

function spawnMeteor() {
  if (!meteors || prefersReducedMotion) return;

  const meteor = document.createElement('span');
  meteor.className = 'meteor';
  meteor.style.left = `${rand(-10, 55)}vw`;
  meteor.style.top = `${rand(-15, 30)}vh`;
  meteor.style.animationDuration = `${rand(1.8, 2.6)}s`;
  meteor.style.width = `${rand(180, 280)}px`;
  meteors.appendChild(meteor);

  window.setTimeout(() => meteor.remove(), 2700);
}

function scheduleMeteors() {
  if (prefersReducedMotion) return;

  const minDelay = isCoarse ? 10000 : 5000;
  const maxDelay = isCoarse ? 18000 : 9000;

  const loop = () => {
    spawnMeteor();
    const next = Math.floor(rand(minDelay, maxDelay));
    window.setTimeout(loop, next);
  };

  window.setTimeout(loop, rand(1800, 4200));
}

let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(createStars, 180);
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  scheduleMeteors();
});
