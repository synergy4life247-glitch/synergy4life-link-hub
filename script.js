document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.hub-button');

  buttons.forEach((button) => {
    button.addEventListener('touchstart', () => {
      button.classList.add('is-tapping');
    }, { passive: true });

    button.addEventListener('touchend', () => {
      window.setTimeout(() => button.classList.remove('is-tapping'), 120);
    });
  });
});
