const glow = document.querySelector('.cursor-glow');
const portrait = document.querySelector('.portrait-frame img');
if (portrait) {
  const portraitFallback = portrait.nextElementSibling;
  if (portraitFallback && portraitFallback.classList.contains('portrait-fallback')) portraitFallback.remove();
  portrait.onload = () => {
    portrait.style.display = 'block';
  };
  portrait.onerror = () => {
    portrait.style.display = 'none';
  };
  portrait.src = 'assets/clive%20passport%20photo.jpg';
  portrait.style.display = 'block';
}
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  window.addEventListener('pointermove', (event) => { targetX = event.clientX; targetY = event.clientY; });
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  function animateGlow(){
    currentX = lerp(currentX, targetX, 0.22);
    currentY = lerp(currentY, targetY, 0.22);
    if (glow) glow.style.transform = `translate(${currentX - 180}px, ${currentY - 180}px)`; // center the 360px glow
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);
} else {
  // simple immediate positioning for reduced motion
  window.addEventListener('pointermove', (event) => { if (glow) glow.style.transform = `translate(${event.clientX - 180}px, ${event.clientY - 180}px)`; });
}

/* Project links (live demo / source) */
const projectLinks = {
  hr: { demo: 'https://hr-payroll-vunoh.vercel.app/', source: 'https://github.com/clivemisiko/Python_Projects.git' },
  leave: { demo: 'https://leave-management-system-ochre.vercel.app/' },
  usafi: { demo: 'https://dependent-trim-cohen-russell.trycloudflare.com/' },
};
document.querySelectorAll('.project-card').forEach((card) => {
  const links = projectLinks[card.dataset.project];
  const caseLink = card.querySelector('.case-link');
  if (!links || !caseLink) return;
  const demo = `<a class="case-link" href="${links.demo}" target="_blank" rel="noreferrer" style="text-decoration:none;display:inline-block;margin-right:18px">Live demo <span>↗</span></a>`;
  const source = links.source ? `<a class="case-link" href="${links.source}" target="_blank" rel="noreferrer" style="text-decoration:none;display:inline-block;margin-right:18px">Source <span>↗</span></a>` : '';
  caseLink.insertAdjacentHTML('beforebegin', `${demo}${source}`);
  caseLink.textContent = 'Case study ↗';
});

/* Filters */
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach((filter) => filter.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('active'));
  filter.classList.add('active');
  const value = filter.dataset.filter;
  cards.forEach((card) => card.classList.toggle('hidden', value !== 'all' && card.dataset.type !== value));
}));

/* Case studies dialog */
const caseStudies = {
  hr: { kicker: '01 / Product build', title: 'HR & Payroll Platform', copy: 'A practical internal platform built around the everyday realities of employee operations — records, leave, payroll, and the need for an audit trail that does not disappear when someone leaves.', points: ['Leave approvals check team coverage and minimum notice periods before progressing.', 'Payroll handles progressive tax brackets, social security deductions, mid-month joiners, and unpaid leave.', 'Soft deactivation keeps historical employee and payroll records intact.', 'Deployed on Vercel with a PostgreSQL / Supabase backend.'], tags: ['Flask', 'PostgreSQL', 'Supabase', 'HTML / CSS / JS'] },
  leave: { kicker: '02 / Service system', title: 'Leave Management System', copy: 'A web-based workflow that moves leave applications out of paperwork and into a clear, role-aware system for staff and administrators.', points: ['Relational MySQL database for employees, leave balances, and approvals.', 'Role-based authentication for staff and administrators.', 'Automated PDF generation for official leave forms.', 'Responsive interface for desktop and mobile devices.'], tags: ['Python', 'Flask', 'MySQL', 'Responsive UI'] },
  usafi: { kicker: '03 / Full-stack product', title: 'UsafiLink', copy: 'A two-sided marketplace for connecting customers with exhaust-truck drivers. The product brings mapping, real-time operations, payments, and background jobs into one service.', points: ['Proximity matching across a 50 km radius with live Mapbox vehicle tracking.', 'M-PESA integration with transaction auditing, payment verification, and dispute handling.', 'Celery + Redis architecture for notifications and scheduled jobs.', 'JWT + Clerk OAuth, TOTP 2FA, role-based access, and automated CI/CD.'], tags: ['Django', 'React / Vite', 'Mapbox GL', 'Celery / Redis'] },
};
const dialog = document.querySelector('#case-dialog');
const content = document.querySelector('.dialog-content');
document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => {
  const study = caseStudies[button.dataset.open];
  content.innerHTML = `<span class="dialog-kicker">${study.kicker}</span><h2>${study.title}</h2><p>${study.copy}</p><ul>${study.points.map((point) => `<li>${point}</li>`).join('')}</ul><div class="tags">${study.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>`;
  dialog.showModal();
  document.querySelector('.dialog-close').focus();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

/* Close dialog with Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dialog.open) dialog.close();
});

/* Theme toggle */
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
function applyTheme(theme){
  if(theme === 'light') body.classList.add('light-theme'); else body.classList.remove('light-theme');
}
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);
if(themeToggle){
  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/* Mobile nav toggle */
const mobileToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');
if(mobileToggle && navLinks){
  mobileToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* Typewriter for hero intro */
const introEl = document.querySelector('.hero-intro');
if(introEl){
  const fullText = introEl.textContent.trim();
  introEl.textContent = '';
  let i = 0;
  const speed = 18;
  const timer = setInterval(() => {
    introEl.textContent += fullText[i++] || '';
    if(i >= fullText.length) clearInterval(timer);
  }, speed);
}

/* Reveal on scroll for project cards */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.project-card').forEach((card, idx) => {
  card.classList.add('reveal');
  if (reducedMotion) {
    card.classList.add('visible');
  } else {
    // staggered delays for nicer entrance
    card.style.transitionDelay = `${idx * 90}ms`;
    observer.observe(card);
  }
});

/* Pause orbit animation when tab is hidden to save CPU */
document.addEventListener('visibilitychange', () => {
  const orbits = document.querySelectorAll('.orbit');
  orbits.forEach((o) => { o.style.animationPlayState = document.hidden ? 'paused' : 'running'; });
});
