const nav = document.querySelector('#site-nav');
const visible = nav.querySelector('.visible-links');
const overflow = nav.querySelector('.hidden-links');
const toggle = nav.querySelector('button');
const links = Array.from(visible.children);

function closeMenu() {
  overflow.classList.add('hidden');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.classList.remove('close');
}

function fitNavigation() {
  closeMenu();
  visible.append(...links);
  toggle.classList.add('hidden');
  if (visible.offsetWidth <= nav.clientWidth) return;
  toggle.classList.remove('hidden');
  const available = nav.clientWidth - toggle.offsetWidth - 12;
  while (visible.children.length > 1 && visible.offsetWidth > available) {
    overflow.prepend(visible.lastElementChild);
  }
}

toggle.addEventListener('click', () => {
  const open = overflow.classList.toggle('hidden') === false;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.classList.toggle('close', open);
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target) || event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !overflow.classList.contains('hidden')) {
    closeMenu();
    toggle.focus();
  }
});
fitNavigation();
window.addEventListener('resize', fitNavigation);

const sections = [...document.querySelectorAll('.story-section')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-enhanced');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -4% 0px' });
  sections.forEach((section, index) => {
    section.classList.add('reveal-on-scroll');
    section.style.setProperty('--reveal-delay', Math.min(index * 70, 280) + 'ms');
    observer.observe(section);
  });
}

if (!reducedMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
  document.querySelectorAll('.paper-box').forEach(card => {
    card.classList.add('paper-tilt');
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty('--rx', (0.5 - y / rect.height) * 5 + 'deg');
      card.style.setProperty('--ry', (x / rect.width - 0.5) * 7 + 'deg');
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
    });
    card.addEventListener('pointerleave', () => {
      ['--rx', '--ry', '--glow-x', '--glow-y'].forEach(key => card.style.removeProperty(key));
    });
  });
}

const progress = document.querySelector('.scroll-progress');
function updateProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = 'scaleX(' + (distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0) + ')';
}
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('resize', updateProgress);
window.addEventListener('load', updateProgress);
updateProgress();
