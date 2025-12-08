const BIN_ID = '693257c5ae596e708f848e4c';
const ACCESS_KEY = '$2a$10$1UPzyBrO337L7S4AluY5jOwV/B.ZuwU0HHJy92El225DAgvgtz8.S';

function getLocal() {
  return JSON.parse(localStorage.getItem('projects')) || [];
}

function setLocal(cards) {
  localStorage.setItem('projects', JSON.stringify(cards));
}

function getLocalProject(title) {
  const cards = getLocal();
  return cards.find(c => c.title === title);
}

function flash(el) {
  el.classList.add('flash');
  setTimeout(() => {
    el.classList.remove('flash');
  }, 4000);
}

function reveal(el) {
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
  }, 4000);
}

function formError(err, output, el) {
  output.value = err;
  reveal(output);
  flash(el);
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
  if (getLocalProject(title)) {
    console.log('duplicate project title');
    let output = document.querySelector('#create-output');
    let title = document.querySelector('#create-form').elements['title'];
    formError('A project with that title already exists', output, title);
    return;
  }
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
    updateSelect();
  } else if (buttonId === 'create-remote') {
    console.log('create remote project-card')
    updateSelect();
  }
});

function updateSelect() {
  const updateSelect = document.querySelector('#update-select');
  const removeSelect = document.querySelector('#remove-select');
  const placeholder = document.createElement('option');
  placeholder.value = '';
  const placeholder2 = placeholder.cloneNode('true');
  updateSelect.appendChild(placeholder);
  removeSelect.appendChild(placeholder2);

  const updateLocalOptGroup = document.querySelector('#update-local-optgroup');
  const removeLocalOptGroup = document.querySelector('#remove-local-optgroup');
  const localProjects = getLocal();
  localProjects.forEach((project) => {
    const option = document.createElement('option');
    option.value = project.title;
    option.textContent = project.title;
    const option2 = option.cloneNode(true);
    updateLocalOptGroup.appendChild(option);
    removeLocalOptGroup.appendChild(option2);
  });
}
updateSelect();

function clearForm(form) {
  const fields = form.elements;
  fields['title'].value = '';
  fields['image'].value = '';
  fields['image-alt'].value = '';
  fields['desc'].value = '';
  fields['link'].value = '';
}

const updateSelectEl = document.querySelector('#update-select')
updateSelectEl.addEventListener('change', (event) => {
  console.log('change detected');
  const form = document.querySelector('#update-form');
  const fields = form.elements;
  const title = fields['select'].value;
  const project = getLocalProject(title);
  if (project) {
    fields['title'].value = project.title;
    fields['image'].value = project.img;
    fields['image-alt'].value = project.imgAlt;
    fields['desc'].value = project.desc;
    fields['link'].value = project.link;
  } else {
    clearForm(form);
  }
})
