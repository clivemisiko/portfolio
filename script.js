const glow = document.querySelector('.cursor-glow');
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
  usafi: { demo: 'https://usafilink.vercel.app/' },
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
  report: { kicker: '01 / AI & data', title: 'Weekly Market Report Generator', copy: "An investment firm's analysts wrote their weekly market report by hand from CBK, NSE and REIT data. This tool drafts it for them, and checks every figure in the draft against its source before an analyst signs off. I was the sole developer.", points: ['An LLM drafts the report sections from the week\'s CBK, NSE and REIT data.', 'Every figure in the draft is checked against its source value before review.', 'Analysts read the draft alongside the checks in a FastAPI and Next.js review app, then sign off.', 'Containerised with Docker Compose and covered by 700+ automated tests.', 'Client work, so the code is private. Happy to walk through it in an interview.'], tags: ['Python', 'LLMs', 'FastAPI', 'Next.js', 'Docker Compose'] },
  hr: { kicker: '02 / Product build', title: 'HR & Payroll Platform', copy: 'An internal platform for employee records, leave and payroll, built as a technical assessment for Vunoh Global. It keeps an audit trail that does not disappear when someone leaves.', points: ['Leave approvals check team coverage and minimum notice before they go through, and escalate automatically if unanswered after 48 hours.', 'Payroll applies progressive tax brackets and pro-rates pay for mid-month joiners and unpaid leave.', 'Records are deactivated, not deleted, so payroll history survives an exit.', 'Deployed on Vercel with a PostgreSQL / Supabase backend.'], tags: ['Flask', 'PostgreSQL', 'Supabase', 'HTML / CSS / JS'] },
  usafi: { kicker: '03 / Full-stack product', title: 'UsafiLink', copy: 'A two-sided marketplace that matches customers with exhauster truck drivers. It brings mapping, live operations, payments and background jobs into one service.', points: ['Matches customers with drivers within 50 km, with live GPS tracking on a Mapbox map.', 'M-PESA payments with transaction auditing, payment verification and dispute resolution, plus a cash fallback with admin override.', 'Celery and Redis background jobs for SMS and email notifications.', 'JWT authentication with two-factor login. Deployed on Vercel.'], tags: ['Django', 'React', 'MySQL', 'Celery / Redis', 'Mapbox'] },
  leave: { kicker: '04 / Service system', title: 'Leave Management System', copy: 'A prototype for the Ministry of Information, Communications and the Digital Economy that replaces a paper-based leave process with a web system for staff and administrators.', points: ['MySQL schema for employee records, leave balances and approval history.', 'Separate staff and administrator access.', 'Generates official leave forms as PDFs.', 'Works on desktop and mobile.'], tags: ['Python', 'Flask', 'MySQL', 'Responsive UI'] },
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
