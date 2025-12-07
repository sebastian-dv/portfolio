const BIN_ID = '693257c5ae596e708f848e4c';
const ACCESS_KEY = '$2a$10$1UPzyBrO337L7S4AluY5jOwV/B.ZuwU0HHJy92El225DAgvgtz8.S';

function getLocal() {
  return JSON.parse(localStorage.getItem('projects')) || [];
}

function setLocal(cards) {
  localStorage.setItem('projects', JSON.stringify(cards));
}

function createLocal(title, img, imgAlt, desc, link) {
  const cards = getLocal();
  const newCard = {
    'title': title,
    'img': img,
    'imgAlt': imgAlt,
    'desc': desc,
    'link': link,
    'target': link === '' ? '_self' : '_blank'
  };
  cards.push(newCard);
  setLocal(cards);
}

const form = document.querySelector('#create-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const buttonId = event.submitter.id;
  const field = form.elements;
  const title = field['title'].value.trim();
  const img = field['image'].value.trim();
  const imgAlt = field['image-alt'].value.trim();
  const desc = field['desc'].value.trim();
  const link = field['link'].value.trim();
  console.log(field);
  if (buttonId === 'create-local') {
    console.log('create local project-card')
    createLocal(title, img, imgAlt, desc, link);
  } else if (buttonId === 'create-remote') {
    console.log('create remote project-card')
  }
});
