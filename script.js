const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
const closeMenu = () => {
  nav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open menu');
};
document.querySelectorAll('.nav nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const form = document.querySelector('.booking-form');
const phoneInput = form?.querySelector('input[name="phone"]');
phoneInput?.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
});
form?.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name') || 'there';
  const status = form.querySelector('.form-status');
  const endpoint = form.dataset.sheetEndpoint;
  const payload = new URLSearchParams({
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    event: formData.get('event') || '',
    phone: formData.get('phone') || '',
    date: formData.get('date') || '',
    venue: formData.get('venue') || '',
    message: formData.get('message') || '',
    submittedAt: new Date().toISOString()
  });

  if (!endpoint) {
    status.textContent = 'Your enquiry could not be sent. Please start on WhatsApp instead.';
    return;
  }

  status.textContent = 'Sending your enquiry…';
  fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: payload.toString()
  }).then(() => {
    status.textContent = `Thank you, ${name}. Your enquiry is on its way to The Karvaan Project.`;
    form.reset();
  }).catch(() => {
    status.textContent = 'We could not send your enquiry. Please start on WhatsApp instead.';
  });
});

const siteHeader = document.querySelector('.nav');
const scrollCue = document.querySelector('.scroll-cue');
const updateHeaderVisibility = () => {
  const hasScrolled = window.scrollY > 24;
  const isHomeHeader = siteHeader?.id === 'top';
  siteHeader?.classList.toggle('is-visible', !isHomeHeader || hasScrolled);
  scrollCue?.classList.toggle('is-hidden', hasScrolled);
};
updateHeaderVisibility();
window.addEventListener('scroll', updateHeaderVisibility, { passive: true });

const collectiveImages = [...document.querySelectorAll('.band-teaser-photos img')];
const collectiveMembers = [
  { src: 'assets/guitarist-mobile.jpg', alt: 'The Karvaan Project guitarist' },
  { src: 'assets/drummer-mobile.jpg', alt: 'The Karvaan Project drummer' },
  { src: 'assets/dholak-mobile.jpg', alt: 'The Karvaan Project dholak player' },
  { src: 'assets/tabla-mobile.jpg', alt: 'The Karvaan Project tabla player' },
  { src: 'assets/pianist-mobile.jpg', alt: 'The Karvaan Project pianist' },
  { src: 'assets/singer-1-mobile.jpg', alt: 'The Karvaan Project singer' },
  { src: 'assets/singer-2-mobile.jpg', alt: 'The Karvaan Project singer' },
  { src: 'assets/singer-3-mobile.jpg', alt: 'The Karvaan Project singer' },
  { src: 'assets/singer-4-mobile.jpg', alt: 'The Karvaan Project singer' }
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

const startCollectiveRotation = () => {
  if (!collectiveImages.length) return;
  rotateCollectiveImages();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(rotateCollectiveImages, 5000);
  }
};

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(startCollectiveRotation, { timeout: 2500 });
} else {
  window.setTimeout(startCollectiveRotation, 700);
}

document.querySelectorAll('[data-video-slider]').forEach(slider => {
  const track = slider.querySelector('.video-track');
  const slides = [...slider.querySelectorAll('.video-slide')];
  const previous = slider.querySelector('.previous');
  const next = slider.querySelector('.next');
  let activeIndex = 0;

  const updateSlider = () => {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === slides.length - 1;
  };

  previous?.addEventListener('click', () => {
    activeIndex = Math.max(0, activeIndex - 1);
    updateSlider();
  });
  next?.addEventListener('click', () => {
    activeIndex = Math.min(slides.length - 1, activeIndex + 1);
    updateSlider();
  });
  updateSlider();
});

document.querySelectorAll('[data-reel-slider]').forEach(slider => {
  const cards = [...slider.querySelectorAll('.reel-card')];
  const dots = [...slider.querySelectorAll('.reel-dots button')];
  const previous = slider.querySelector('.previous');
  const next = slider.querySelector('.next');
  let activeIndex = 0;
  let autoSlide;

  const updateSlider = () => {
    cards.forEach((card, index) => {
      card.classList.remove('is-active', 'is-next', 'is-previous');
      if (index === activeIndex) card.classList.add('is-active');
      else if (cards.length === 2) card.classList.add(activeIndex === 0 ? 'is-next' : 'is-previous');
      else if (index === (activeIndex + 1) % cards.length) card.classList.add('is-next');
      else card.classList.add('is-previous');
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
      dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
  };

  const moveTo = index => {
    activeIndex = (index + cards.length) % cards.length;
    updateSlider();
  };
  const startAutoSlide = () => {
    if (cards.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.clearInterval(autoSlide);
    autoSlide = window.setInterval(() => moveTo(activeIndex + 1), 4000);
  };

  previous?.addEventListener('click', () => { moveTo(activeIndex - 1); startAutoSlide(); });
  next?.addEventListener('click', () => { moveTo(activeIndex + 1); startAutoSlide(); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { moveTo(index); startAutoSlide(); }));
  slider.addEventListener('mouseenter', () => window.clearInterval(autoSlide));
  slider.addEventListener('mouseleave', startAutoSlide);
  slider.addEventListener('focusin', () => window.clearInterval(autoSlide));
  slider.addEventListener('focusout', startAutoSlide);
  updateSlider();
  startAutoSlide();
});
