const tasks = {
  franka: [
    {title: 'Place the ball in the basket', file: 'franka-basket'},
    {title: 'Stack the bowls', file: 'franka-bowls'},
    {title: 'Open the drawer', file: 'franka-drawer'}
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

const player = document.querySelector('#demo-video');
const taskList = document.querySelector('#task-list');
const platformButtons = document.querySelectorAll('[data-platform]');

function selectTask(task, selectedButton, play) {
  taskList.querySelectorAll('button').forEach(button => {
    const selected = button === selectedButton;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', selected);
  });
  player.poster = `${task.file}.jpg`;
  player.src = `${task.file}.mp4`;
  document.querySelector('#demo-title').textContent = task.title;
  if (play) player.play().catch(() => {});
}

function selectPlatform(platform, play) {
  platformButtons.forEach(button => {
    const selected = button.dataset.platform === platform;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', selected);
  });
  taskList.replaceChildren();
  tasks[platform].forEach((task, index) => {
    const button = document.createElement('button');
    button.className = 'task';
    button.append(document.createTextNode(task.title));
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    button.append(arrow);
    button.addEventListener('click', () => selectTask(task, button, true));
    taskList.append(button);
    if (index === 0) selectTask(task, button, play);
    else button.setAttribute('aria-pressed', 'false');
  });
}
platformButtons.forEach(button => button.addEventListener('click', () => selectPlatform(button.dataset.platform, true)));
selectPlatform('franka', false);

const ambientVideos = document.querySelectorAll('.ambient');
const motionToggle = document.querySelector('#motion-toggle');
let motionPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateMotion() {
  ambientVideos.forEach(video => {
    if (motionPaused || document.hidden) video.pause();
    else video.play().catch(() => {});
  });
  motionToggle.textContent = motionPaused ? 'Play motion ▷' : 'Pause motion Ⅱ';
  motionToggle.setAttribute('aria-pressed', motionPaused);
}
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);
updateMotion();

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
