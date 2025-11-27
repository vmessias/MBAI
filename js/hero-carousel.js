document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  const interval = 6000; // 6 segundos

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  // começa mostrando a primeira
  showSlide(current);

  setInterval(() => {
    current = (current + 1) % total;
    showSlide(current);
  }, interval);
});
