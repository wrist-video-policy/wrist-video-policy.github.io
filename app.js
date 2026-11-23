const tasks = {
  franka: [
    {title: "Stack the bowls together", file: "franka-stack-bowls3", views: 2},
    {title: "Put the basketball into the basket", file: "franka-short-put-basketball", views: 2},
    {title: "Pick the pen into the box", file: "franka-short-pick-pen", views: 2},
    {title: "Open the drawer", file: "franka-drawer4-uniform", views: 2},
    {title: "Press the plug into the socket", file: "franka-short-press-charger-down", views: 2},
    {title: "Put the cap in the bowl", file: "franka-short-put-cap-in-bowl", views: 2},
    {title: "Put the cup on the green plate", file: "franka-short-put-cup-on-plate", views: 2},
    {title: "Fold the towel from top to bottom", file: "franka-short-fold-towel", views: 2},
    {title: "Insert the stick into the cup", file: "franka-insert-stick-5s", views: 2},
    {title: "Put the chopsticks on the green plate and release the gripper", file: "franka-short-put-chopsticks", views: 2},
    {title: "Remove the plug from the socket", file: "franka-short-remove-plug-out", views: 2}
  ],
  piper: [
    {title: 'Use the left gripper to put the bread on the black plate, then use the right gripper to put the vegetable on the bread', file: 'piper-bimanual-bread-vegetable'},
    {title: 'Grasp both handles of the basket and lift it with both hands', file: 'piper-success-lift-basket-both-hands'},
    {title: 'Wipe the plate with the towel', file: 'piper-success-wipe-plate'},
    {title: 'Put the rubik’s cube on the plate', file: 'piper-success-cube-on-plate'},
    {title: 'Insert the bread into the toaster then release the bread', file: 'piper-success-bread-in-toaster'},
    {title: 'Grasp the kettle by its handle and pour water into the cup', file: 'piper-success-pour-water'},
    {title: 'Put the bread on the black plate', file: 'piper-success-left-place-bread'},
    {title: 'Put the vegetable on the bread', file: 'piper-bread'},
    {title: 'Wipe the plate with the towel', file: 'piper-wipe'},
    {title: 'Put the chicken wing into the bowl', file: 'piper-plate'},
    {title: 'Lift the bucket with the right arm', file: 'piper-demo-lift-bucket'},
    {title: 'Put the rubik’s cube on the plate', file: 'piper-demo-pick-rubik-cube'},
    {title: 'Stack the cups', file: 'piper-demo-stack-cups'},
    {title: 'Put the green cube into the bowl', file: 'piper-demo-put-green-cube'},
    {title: 'Put the red cube into the bowl', file: 'piper-demo-put-red-cube-recovery'},
    {title: 'Put the vegetable on the bread', file: 'piper-demo-put-vegetable-2'}
  ],
  galaxea: [
    {title: 'Open the washing machine door', file: 'galaxea-door-soft-background'},
    {title: 'Grip the knob and maintain the grasping posture', file: 'galaxea-knob-soft-background'},
    {title: 'Pick up the fallen clothes from the floor', file: 'galaxea-laundry-soft-background'},
    {title: 'Take the clothes out of the washing machine', file: 'galaxea-take-clothes-soft-background'}
  ]
};

const names = {franka:'Franka Panda',piper:'PiPER-X',galaxea:'Galaxea R1 Pro'};
const gallery = document.querySelector('#video-gallery');
for (const [platform, entries] of Object.entries(tasks)) {
  const section = document.createElement('section');
  section.className = 'robot-group';
  section.dataset.robot = platform;
  section.innerHTML = `<h3 class="robot-title"><span>${names[platform]}</span></h3><div class="video-grid"></div>`;
  for (const task of entries) {
    const card = document.createElement('article');
    card.className = 'video-card';
    const video = document.createElement('video');
    video.dataset.src = `${task.file}.mp4?v=franka-update2`;
    video.poster = `${task.file}.jpg?v=franka-update2`;
    video.controls = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', `${names[platform]}: ${task.title}`);
    const caption = document.createElement('div');
    caption.className = 'video-caption';
    const title = document.createElement('h3');
    title.textContent = task.title;
    const views = document.createElement('p');
    views.textContent = platform === 'franka' ? 'Wrist + external view' : 'Two wrists + external view';
    caption.append(title,views);
    card.append(video,caption);
    section.querySelector('.video-grid').append(card);
  }
  gallery.append(section);
}
const demoVideos = [...gallery.querySelectorAll('video')];
const mediaObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const video = entry.target;
    if (entry.isIntersecting && !video.src) video.src = video.dataset.src;
    if (!entry.isIntersecting) video.pause();
  }
},{rootMargin:'120px'});
demoVideos.forEach(video => mediaObserver.observe(video));
document.querySelectorAll('[data-platform]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-platform]').forEach(item => {
      item.classList.toggle('selected',item === button);
      item.setAttribute('aria-pressed',String(item === button));
    });
    document.querySelectorAll('.robot-group').forEach(section => {
      section.hidden = button.dataset.platform !== 'all' && section.dataset.robot !== button.dataset.platform;
    });
    demoVideos.forEach(video => video.pause());
  });
});
const dialog = document.querySelector('#figure-dialog');
document.querySelectorAll('[data-figure]').forEach(button => button.addEventListener('click',()=>{
  const image = document.querySelector('#figure-image');
  image.src = button.dataset.figure;
  image.alt = button.querySelector('img').alt;
  document.querySelector('#figure-title').textContent = button.dataset.title;
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target === dialog) dialog.close();});
const comparisons = [...document.querySelectorAll('.comparison-video')];
document.querySelector('#play-comparison').addEventListener('click',()=>{
  demoVideos.forEach(video=>video.pause());
  comparisons.forEach(video=>{video.currentTime=0;video.play();});
});
document.querySelector('#pause-comparison').addEventListener('click',()=>comparisons.forEach(video=>video.pause()));
const themeButton = document.querySelector('#theme-toggle');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? 'Light' : 'Dark';
  themeButton.setAttribute('aria-label',`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
}
setTheme(localStorage.getItem('wvp-theme') || 'light');
themeButton.addEventListener('click',()=>{
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);localStorage.setItem('wvp-theme',theme);
});
const canvas = document.querySelector('#sky');
const context = canvas.getContext('2d');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const particles = Array.from({length:85},()=>({x:Math.random(),y:Math.random(),size:1+Math.random()*3,phase:Math.random()*Math.PI*2,speed:.3+Math.random()*.8,star:false}));
function resizeSky(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
resizeSky();addEventListener('resize',resizeSky);
function drawSky(time) {
  const t=reduceMotion.matches?0:time/1000;
  context.clearRect(0,0,innerWidth,innerHeight);
  const dark=document.documentElement.dataset.theme === 'dark';
  particles.forEach((p,i)=>{
    const x=p.x*innerWidth+Math.sin(t*.13*p.speed+p.phase)*24;
    const y=(p.y*innerHeight+t*2*p.speed)%(innerHeight+30)-15;
    context.fillStyle=dark?['#75c6ed','#a7d8ee','#7097ca'][i%3]:['#5599ba','#82acc9','#497d9d'][i%3];
    context.globalAlpha=(dark?.32:.24)+.12*Math.sin(t*.7+p.phase);
    context.beginPath();
    if(p.star){const r=p.size*2;context.moveTo(x,y-r);context.quadraticCurveTo(x+1,y-1,x+r,y);context.quadraticCurveTo(x+1,y+1,x,y+r);context.quadraticCurveTo(x-1,y+1,x-r,y);context.quadraticCurveTo(x-1,y-1,x,y-r);}else context.arc(x,y,p.size*.5,0,Math.PI*2);
    context.fill();
  });
  context.globalAlpha=1;
  requestAnimationFrame(drawSky);
}
requestAnimationFrame(drawSky);
