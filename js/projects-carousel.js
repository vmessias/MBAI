document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.projects-track');
  const cards = document.querySelectorAll('.project-card');
  const prevBtn = document.querySelector('.carousel-nav--prev');
  const nextBtn = document.querySelector('.carousel-nav--next');
  const currentCounter = document.querySelector('.projects-counter .current');

  if (!track || !cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 1.8 * 16; // 1.8rem em pixels
  const totalCards = cards.length;

  let currentIndex = 0;

  function updateCounter() {
    currentCounter.textContent = String(currentIndex + 1).padStart(2, '0');
  }

  function updateActiveCard() {
    // remove classe de todos
    cards.forEach(card => card.classList.remove('is-active'));
    // adiciona no card atual
    cards[currentIndex].classList.add('is-active');
  }

  function scrollToIndex(index) {
    const scrollAmount = index * (cardWidth + gap);
    track.scrollLeft = scrollAmount;
    currentIndex = index;
    updateCounter();
    updateActiveCard();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - 1) {
      scrollToIndex(currentIndex + 1);
    }
  });

  // inicializa
  updateCounter();
  updateActiveCard();
});
