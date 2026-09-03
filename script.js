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
  form.querySelector('.form-status').textContent = `Thank you, ${name}. Your enquiry has been captured in this demo.`;
  form.reset();
});
