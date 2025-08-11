/* LUVO — interactive particles + hamburger panel
   - particle canvas covers whole page (behind content)
   - on mouse move: particles form a string-art camera at cursor
   - on click: camera holds for a short time
   - mobile/desktop adaptive particle count
*/

/* -------------------------
   1) Setup canvas + resize
   ------------------------- */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let DPR = Math.max(window.devicePixelRatio || 1, 1);
let W = 0, H = 0;
function resize(){
  DPR = Math.max(window.devicePixelRatio || 1, 1);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

/* -------------------------
   2) Particles configuration
   ------------------------- */
// adapt particle count to viewport for performance
const particleCount = (() => {
  if (W > 1600) return 420;
  if (W > 1200) return 320;
  if (W > 800) return 260;
  return 160;
})();

const particles = [];
const maxLinkDistance = 110; // distance to draw lines (smaller on mobile if needed)
const maxLinksPerParticle = 6;

/* basic particle object */
class Particle {
  constructor(i) {
    this.i = i;
    this.reset(true);
  }
  reset(initial=false){
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = 1 + Math.random() * 1.6;
    this.target = null; // {x,y} when forming
    this.home = { x: this.x, y: this.y };
    this.opacity = 0.95;
    if (!initial) {
      // place randomly around page for subtle movement
      this.x = Math.random() * W;
      this.y = Math.random() * H;
    }
  }
  update(dt, formingStrength) {
    // if we have a formation target, ease toward it
    if (this.target && formingStrength > 0.01) {
      const tx = this.target.x;
      const ty = this.target.y;
      // spring easing
      this.vx += (tx - this.x) * 0.0025 * formingStrength;
      this.vy += (ty - this.y) * 0.0025 * formingStrength;
      // damping
      this.vx *= 0.92;
      this.vy *= 0.92;
      this.x += this.vx;
      this.y += this.vy;
    } else {
      // wander / slight return to home
      this.vx += (this.home.x - this.x) * 0.00025;
      this.vy += (this.home.y - this.y) * 0.00025;
      // small random
      this.vx += (Math.random() - 0.5) * 0.04;
      this.vy += (Math.random() - 0.5) * 0.04;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
    }

    // keep inside + wrap
    if (this.x < -20) this.x = W + 20;
    else if (this.x > W + 20) this.x = -20;
    if (this.y < -20) this.y = H + 20;
    else if (this.y > H + 20) this.y = -20;
  }
  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* initialize */
for (let i=0;i<particleCount;i++){
  particles.push(new Particle(i));
}

/* -------------------------
   3) Camera (string-art) target points generator
   ------------------------- */
/* generate many points composing a camera-like outline:
   - rectangular body (outline)
   - circular lens
   - small flash circle
   return array of points [{x,y},...]
*/
function generateCameraPoints(cx, cy, scale = 220) {
  const pts = [];
  const w = scale * 1.0;
  const h = scale * 0.74;
  const stepsSide = Math.floor(scale / 4) + 24; // number points on each side
  // top side left->right
  for (let i=0;i<stepsSide;i++){
    const t = i / stepsSide;
    pts.push({ x: cx - w/2 + t*w, y: cy - h/2 });
  }
  // right side top->bottom
  for (let i=0;i<stepsSide;i++){
    const t = i / stepsSide;
    pts.push({ x: cx + w/2, y: cy - h/2 + t*h });
  }
  // bottom right->left
  for (let i=0;i<stepsSide;i++){
    const t = i / stepsSide;
    pts.push({ x: cx + w/2 - t*w, y: cy + h/2 });
  }
  // left bottom->top
  for (let i=0;i<stepsSide;i++){
    const t = i / stepsSide;
    pts.push({ x: cx - w/2, y: cy + h/2 - t*h });
  }

  // lens (circle in center)
  const lensR = scale * 0.28;
  const lensSteps = Math.floor(scale / 2.2) + 80;
  for (let i=0;i<lensSteps;i++){
    const a = (i / lensSteps) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * lensR, y: cy + Math.sin(a) * lensR });
  }

  // small flash top-right (icon dot)
  const flashR = Math.max(6, scale * 0.06);
  const flashCX = cx + w*0.32;
  const flashCY = cy - h*0.34;
  const flashSteps = 36;
  for (let i=0;i<flashSteps;i++){
    const a = (i / flashSteps) * Math.PI * 2;
    pts.push({ x: flashCX + Math.cos(a) * flashR, y: flashCY + Math.sin(a) * flashR });
  }

  // shuffle to distribute points variety
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return pts;
}

/* -------------------------
   4) Formation control
   ------------------------- */
let forming = false;
let formingPoints = [];
let formingCenter = {x: W/2, y: H/2};
let formingScale = Math.min(300, Math.max(140, Math.min(W, H) * 0.25));
let formingStrength = 0; // 0..1 - used in easing
let holdTimeout = null;

function setFormationAt(x, y, scale = null, holdMs = 0) {
  forming = true;
  formingCenter = {x,y};
  if (scale) formingScale = scale;
  formingPoints = generateCameraPoints(x, y, formingScale);
  // assign targets to particles (map each particle to a point)
  for (let i=0;i<particles.length;i++){
    const pt = formingPoints[i % formingPoints.length];
    // slight jitter to avoid perfect grid
    const jitter = (Math.random() - 0.5) * (formingScale * 0.03);
    particles[i].target = { x: pt.x + jitter, y: pt.y + jitter };
  }
  // animate formingStrength quickly to 1
  formingStrength = 0.001;
  if (holdTimeout) clearTimeout(holdTimeout);
  if (holdMs > 0) {
    holdTimeout = setTimeout(() => releaseFormation(), holdMs);
  }
}

function releaseFormation(){
  forming = false;
  formingPoints = [];
  // clear targets
  for (let p of particles) p.target = null;
}

/* When mouse moves: form a camera shape but light (not full hold)
   On click: form a stronger camera and hold a bit.
*/
let lastMouse = {x: W/2, y: H/2};
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  lastMouse = {x,y};
  // create a light formation that follows cursor
  setFormationAt(x, y, Math.min(260, Math.max(130, Math.min(W,H)*0.18)), 0);
});

/* click: hold stronger */
document.addEventListener('click', (e) => {
  setFormationAt(e.clientX, e.clientY, Math.min(360, Math.max(160, Math.min(W,H)*0.25)), 1400);
});

/* Also form in center on load briefly to show effect */
setFormationAt(W/2, H/2, Math.min(320, Math.max(160, Math.min(W,H)*0.22)), 700);

/* -------------------------
   5) Animation loop (draw + lines)
   ------------------------- */
let lastT = performance.now();
function animate(t){
  const dt = Math.min(40, t - lastT);
  lastT = t;
  // ease formingStrength
  const targetF = forming ? 1 : 0;
  formingStrength += (targetF - formingStrength) * 0.08;

  // clear
  ctx.clearRect(0,0,W,H);

  // subtle background effect (optional)
  // draw particles
  // style for glow
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 0.8;
  ctx.shadowBlur = 12 * (0.5 + formingStrength*1.2);
  ctx.shadowColor = 'rgba(255,255,255,0.9)';

  // update particles
  for (let p of particles) p.update(dt, formingStrength);

  // draw lines - naive O(n^2) but particleCount limited adaptively
  // for performance we limit inner loops: for each i, j from i+1 .. i+limit
  const len = particles.length;
  const maxIters = Math.min(len, 380); // safe cap
  // draw lines
  for (let i=0;i<maxIters;i++){
    const a = particles[i];
    // connect to a subset to limit cost
    let linksCount = 0;
    for (let j = i+1; j < len && linksCount < maxLinksPerParticle; j++){
      const b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < maxLinkDistance){
        const alpha = (1 - dist / maxLinkDistance) * 0.18 * (0.4 + formingStrength*1.6);
        if (alpha > 0.01){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          linksCount++;
        }
      }
    }
  }

  // draw dots on top
  ctx.shadowBlur = 18 * (0.6 + formingStrength*1.2);
  ctx.shadowColor = 'rgba(255,255,255,0.95)';
  for (let p of particles) p.draw(ctx);

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* -------------------------
   6) Header / hamburger behavior
   ------------------------- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

let mobilePanel = null;
function makeMobilePanel(){
  mobilePanel = document.createElement('div');
  mobilePanel.className = 'mobile-panel';
  // clone navlinks inside
  const links = Array.from(navLinks.querySelectorAll('a'));
  links.forEach(a=>{
    const na = document.createElement('a');
    na.href = a.href;
    na.textContent = a.textContent;
    mobilePanel.appendChild(na);
  });
  document.body.appendChild(mobilePanel);
}
makeMobilePanel();

menuBtn.addEventListener('click', ()=>{
  const open = menuBtn.classList.toggle('open');
  if (open){
    menuBtn.setAttribute('aria-expanded','true');
    mobilePanel.classList.add('open');
  } else {
    menuBtn.setAttribute('aria-expanded','false');
    mobilePanel.classList.remove('open');
  }
});
// close panel if link clicked
document.addEventListener('click', (e)=>{
  if (!mobilePanel.contains(e.target) && !menuBtn.contains(e.target) && mobilePanel.classList.contains('open')){
    menuBtn.classList.remove('open');
    mobilePanel.classList.remove('open');
  }
});

/* -------------------------
   7) Optional: simple contact handler to avoid form navigation
   ------------------------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // just a simple toast substitute (console log)
    alert('Thanks! Message received — this demo does not send mail. Replace handler in script.js for real submission.');
    contactForm.reset();
  });
}

/* -------------------------
   Performance tips (notes inside file)
   - To reduce load: lower particleCount (re-create particles)
   - To remove heavy line drawing: set maxLinkDistance = 60 or 0
   ------------------------- */
