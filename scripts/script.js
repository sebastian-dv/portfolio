const themeToggleBtn = document.querySelector('#theme-toggle');
themeToggleBtn.classList.add('js-enabled');
const body = document.querySelector('body');

const DARK = '(prefers-color-scheme: dark)';
const preferredTheme = window.matchMedia(DARK) ? 'dark-theme' : 'light-theme';
let currentTheme = localStorage.getItem('theme') || preferredTheme;
document.body.classList.add(currentTheme);

function toggleTheme() {
  document.body.classList.remove(currentTheme);
  if (currentTheme === 'light-theme') {
    currentTheme = 'dark-theme';
    document.body.classList.add(currentTheme);
  } else {
    currentTheme = 'light-theme';
    document.body.classList.add(currentTheme);
  }
  localStorage.setItem('theme', currentTheme);
}

themeToggleBtn.addEventListener('click', toggleTheme);
