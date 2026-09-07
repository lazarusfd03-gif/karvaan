const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.nav nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('.booking-form');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const name = new FormData(form).get('name') || 'there';
  form.querySelector('.form-status').textContent = `Thank you, ${name}. Your enquiry is with us — we will be in touch to shape the night.`;
  form.reset();
});

const siteHeader = document.querySelector('.nav');
const scrollCue = document.querySelector('.scroll-cue');
const updateHeaderVisibility = () => {
  const hasScrolled = window.scrollY > 24;
  siteHeader?.classList.toggle('is-visible', hasScrolled);
  scrollCue?.classList.toggle('is-hidden', hasScrolled);
};
updateHeaderVisibility();
window.addEventListener('scroll', updateHeaderVisibility, { passive: true });

const collectiveImages = [...document.querySelectorAll('.band-teaser-photos img')];
const collectiveMembers = [
  { src: 'assets/guitarist.png', alt: 'The Karvaan Project guitarist' },
  { src: 'assets/drummer.png', alt: 'The Karvaan Project drummer' },
  { src: 'assets/dholak.png', alt: 'The Karvaan Project dholak player' },
  { src: 'assets/tabla.png', alt: 'The Karvaan Project tabla player' },
  { src: 'assets/pianist.png', alt: 'The Karvaan Project pianist' },
  { src: 'assets/singer-1.png', alt: 'The Karvaan Project singer' },
  { src: 'assets/singer-2.png', alt: 'The Karvaan Project singer' },
  { src: 'assets/singer-3.png', alt: 'The Karvaan Project singer' },
  { src: 'assets/singer-4.png', alt: 'The Karvaan Project singer' }
];

const shuffleMembers = members => [...members].sort(() => Math.random() - 0.5);
const rotateCollectiveImages = () => {
  const nextMembers = shuffleMembers(collectiveMembers).slice(0, collectiveImages.length);
  collectiveImages.forEach((image, index) => {
    image.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = nextMembers[index].src;
      image.alt = nextMembers[index].alt;
      image.classList.remove('is-changing');
    }, 220);
  });
};

if (collectiveImages.length) {
  rotateCollectiveImages();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(rotateCollectiveImages, 5000);
  }
}
