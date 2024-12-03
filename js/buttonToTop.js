const backToTopButton = document.getElementById('backToTop');

window.onscroll = function() {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
};

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0 });
});