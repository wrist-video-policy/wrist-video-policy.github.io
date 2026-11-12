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

const platformNames = {franka: 'Franka', piper: 'PiperX', galaxea: 'Galaxea R1 Pro'};
const gallery = document.querySelector('#video-gallery');
const platformButtons = document.querySelectorAll('[data-platform]');

Object.entries(tasks).forEach(([platform, platformTasks]) => {
  platformTasks.forEach(task => {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.dataset.robot = platform;

    const video = document.createElement('video');
    video.src = `${task.file}.mp4`;
    video.poster = `${task.file}.jpg`;
    video.controls = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', `${platformNames[platform]} — ${task.title}`);
    video.addEventListener('play', () => {
      gallery.querySelectorAll('video').forEach(other => {
        if (other !== video) other.pause();
      });
    });

    const caption = document.createElement('div');
    caption.className = 'video-caption';
    const robot = document.createElement('p');
    robot.textContent = platformNames[platform];
    const title = document.createElement('h3');
    title.textContent = task.title;
    caption.append(robot, title);
    card.append(video, caption);
    gallery.append(card);
  });
});

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
      if (card.hidden) card.querySelector('video').pause();
    });
  });
});

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
