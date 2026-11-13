const tasks = {
  franka: [
    {title: "Stack the bowls together", file: "franka-stack-bowls3", views: 2},
    {title: "Put the basketball into the basket", file: "franka-short-put-basketball", views: 2},
    {title: "Pick the pen into the box", file: "franka-short-pick-pen", views: 2},
    {title: "Open the drawer", file: "franka-drawer4-uniform", views: 2},
    {title: "Press the charger into the socket", file: "franka-short-press-charger-down", views: 2},
    {title: "Put the cap in the bowl", file: "franka-short-put-cap-in-bowl", views: 2},
    {title: "Put the cup on the green plate", file: "franka-short-put-cup-on-plate", views: 2},
    {title: "Fold the towel from top to bottom", file: "franka-short-fold-towel", views: 2},
    {title: "Insert the stick into the cup", file: "franka-short-insert-stick", views: 2},
    {title: "Put the chopsticks on the green plate and release the gripper", file: "franka-short-put-chopsticks", views: 2},
    {title: "Remove the plug from the socket", file: "franka-short-remove-plug-out", views: 2}
  ],
  piper: [
    {title: 'Put the vegetable on the bread', file: 'piper-bread'},
    {title: 'Wipe the plate with a towel', file: 'piper-wipe'},
    {title: 'Put the chicken wing into the bowl', file: 'piper-plate'}
  ],
  galaxea: [
    {title: 'Open the washer door', file: 'galaxea-door'},
    {title: 'Grasp and hold the knob', file: 'galaxea-knob'},
    {title: 'Pick up fallen clothes', file: 'galaxea-laundry'}
  ]
};

const platformNames = {franka: 'Franka', piper: 'PiperX', galaxea: 'Galaxea R1 Pro'};
const gallery = document.querySelector('#video-gallery');
const platformButtons = document.querySelectorAll('[data-platform]');

Object.entries(tasks).forEach(([platform, platformTasks]) => {
  platformTasks.forEach(task => {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.dataset.robot = platform;

    const video = document.createElement('video');
    video.src = `${task.file}.mp4?v=franka-update2`;
    video.poster = `${task.file}.jpg?v=franka-update2`;
    if (task.views) video.style.aspectRatio = task.views === 3 ? '16 / 3' : '32 / 9';
    video.controls = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', `${platformNames[platform]} — ${task.title}, synchronized multi-view recording`);
    video.addEventListener('play', () => {
      gallery.querySelectorAll('video').forEach(other => {
        if (other !== video) other.pause();
      });
    });

    const caption = document.createElement('div');
    caption.className = 'video-caption';
    const robot = document.createElement('p');
    robot.textContent = `${platformNames[platform]} · ${platform === 'franka' ? (task.views === 3 ? 'Wrist + two external views' : 'Wrist + external view') : 'Two wrists + external view'}`;
    const title = document.createElement('h3');
    title.textContent = task.title;
    caption.append(robot, title);
    card.append(video, caption);
    gallery.append(card);
  });
});

const dots = document.querySelector('#video-dots');
const previous = document.querySelector('#previous-video');
const next = document.querySelector('#next-video');
let visibleCards = [...gallery.children];
let currentIndex = 0;

function goToVideo(index) {
  currentIndex = Math.max(0, Math.min(index, visibleCards.length - 1));
  gallery.scrollTo({left: visibleCards[currentIndex].offsetLeft, behavior: 'smooth'});
}

function updateCarousel() {
  const distances = visibleCards.map(card => Math.abs(card.offsetLeft - gallery.scrollLeft));
  currentIndex = distances.indexOf(Math.min(...distances));
  document.querySelector('#video-count').textContent = `${currentIndex + 1} / ${visibleCards.length}`;
  previous.disabled = currentIndex === 0;
  next.disabled = currentIndex === visibleCards.length - 1;
  [...dots.children].forEach((dot, index) => dot.setAttribute('aria-pressed', index === currentIndex));
  visibleCards.forEach((card, index) => {
    if (index !== currentIndex) card.querySelector('video').pause();
  });
}

function buildDots() {
  dots.replaceChildren();
  visibleCards.forEach((card, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', card.querySelector('h3').textContent);
    dot.addEventListener('click', () => goToVideo(index));
    dots.append(dot);
  });
  updateCarousel();
}

platformButtons.forEach(button => {
  button.addEventListener('click', () => {
    const platform = button.dataset.platform;
    platformButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', selected);
    });
    gallery.querySelectorAll('.video-card').forEach(card => {
      card.hidden = platform !== 'all' && card.dataset.robot !== platform;
      card.querySelector('video').pause();
    });
    visibleCards = [...gallery.children].filter(card => !card.hidden);
    gallery.scrollTo({left: 0, behavior: 'instant'});
    buildDots();
  });
});

previous.addEventListener('click', () => goToVideo(currentIndex - 1));
next.addEventListener('click', () => goToVideo(currentIndex + 1));
gallery.addEventListener('scroll', updateCarousel, {passive: true});
gallery.addEventListener('keydown', event => {
  if (event.target !== gallery) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    goToVideo(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
window.addEventListener('resize', updateCarousel);
buildDots();

const dialog = document.querySelector('#figure-dialog');
document.querySelectorAll('[data-figure]').forEach(button => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#figure-image');
    image.src = button.dataset.figure;
    image.alt = button.querySelector('img').alt;
    document.querySelector('#figure-title').textContent = button.dataset.title;
    dialog.showModal();
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
