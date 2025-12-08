const BIN_ID = '693257c5ae596e708f848e4c';
const ACCESS_KEY = '$2a$10$1UPzyBrO337L7S4AluY5jOwV/B.ZuwU0HHJy92El225DAgvgtz8.S';

function getLocal() {
  return JSON.parse(localStorage.getItem('projects')) || [];
}

function setLocal(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function getLocalProject(title) {
  const projects = getLocal();
  return projects.find(p => p.title === title);
}

function getLocalProjectIndex(title) {
  const projects = getLocal();
  return projects.findIndex(p => p.title === title);
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

function createLocal(project) {
  const projects = getLocal();
  const title = project.title;
  if (getLocalProject(title)) {
    console.log('duplicate project title');
    let output = document.querySelector('#create-output');
    let title = document.querySelector('#create-form').elements['title'];
    formError('A project with that title already exists', output, title);
    return;
  }
  projects.push(project);
  setLocal(projects);
}

function removeLocal(title) {
  const projects = getLocal();
  const updated = projects.filter(p => p.title !== title);
  setLocal(updated);
}


const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const buttonId = event.submitter.id;
  const field = createForm.elements;
  const title = field['title'].value.trim();
  const img = field['image'].value.trim();
  const imgAlt = field['image-alt'].value.trim();
  const desc = field['desc'].value.trim();
  const link = field['link'].value.trim();
  const output = document.querySelector('#create-output');
  if (title === '') {
    formError('Project title is required', output, field['title']);
    return;
  }
  const newProject = {
    'title': title,
    'img': img,
    'imgAlt': imgAlt,
    'desc': desc,
    'link': link,
    'target': link === '' ? '_self' : '_blank'
  };
  if (buttonId === 'create-local') {
    console.log('create local project-card')
    createLocal(newProject);
    updateSelect();
    clearForm(createForm);
  } else if (buttonId === 'create-remote') {
    console.log('create remote project-card')
    createRemote(newProject);
    updateSelect();
    clearForm(createForm);
  }
});

async function updateSelect() {
  const updateLocalOptGroup = document.querySelector('#update-local-optgroup');
  const removeLocalOptGroup = document.querySelector('#remove-local-optgroup');
  updateLocalOptGroup.innerHTML = '';
  removeLocalOptGroup.innerHTML = '';
  const localProjects = getLocal();
  localProjects.forEach((project) => {
    const option = document.createElement('option');
    option.value = project.title;
    option.textContent = project.title;
    const option2 = option.cloneNode(true);
    updateLocalOptGroup.appendChild(option);
    removeLocalOptGroup.appendChild(option2);
  });
  const updateRemoteOptGroup = document.querySelector('#update-remote-optgroup');
  const removeRemoteOptGroup = document.querySelector('#remove-remote-optgroup');
  updateRemoteOptGroup.innerHTML = '';
  removeRemoteOptGroup.innerHTML = '';
  const remoteProjects = await getRemote();
  remoteProjects.forEach((project) => {
    const option = document.createElement('option');
    option.value = project.title;
    option.textContent = project.title;
    const option2 = option.cloneNode(true);
    updateRemoteOptGroup.appendChild(option);
    removeRemoteOptGroup.appendChild(option2);
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

function populateForm(fields, project) {
  fields['title'].value = project.title;
  fields['image'].value = project.img;
  fields['image-alt'].value = project.imgAlt;
  fields['desc'].value = project.desc;
  fields['link'].value = project.link;
}

const updateSelectEl = document.querySelector('#update-select')
updateSelectEl.addEventListener('change', async () => {
  console.log('change detected');
  const form = document.querySelector('#update-form');
  const fields = form.elements;
  const title = fields['select'].value;
  const project = getLocalProject(title);
  if (project) {
    populateForm(fields, project);
  } else {
    clearForm(form);
  }
  const remoteProjects = await getRemote();
  const remoteProject = remoteProjects.find(p => p.title === title);
  if (remoteProject) {
    populateForm(fields, remoteProject);
  } else {
    clearForm(form);
  }
})

function updateLocal(title, fields) {
  const projects = getLocal();
  const index = getLocalProjectIndex(title);
  const updatedProject = {
    'title': fields['title'].value,
    'img': fields['image'].value,
    'imgAlt': fields['image-alt'].value,
    'desc': fields['desc'].value,
    'link': fields['link'].value
  };
  projects[index] = {
    ...projects[index],
    ...updatedProject
  };
  setLocal(projects);
}

const updateForm = document.querySelector('#update-form');
updateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = updateForm.elements;
  const select = fields['select'];
  const option = select.options[select.selectedIndex];
  const title = option.value;
  const output = document.querySelector('#update-output');
  if (title === '') {
    formError('Please select a project', output, select);
    return;
  }
  const optGroup = option.closest('optgroup').id;
  if (optGroup === 'update-local-optgroup') {
    console.log('updating local');
    updateLocal(title, fields);
    updateSelect();
    clearForm(updateForm);
  } else if (optGroup === 'update-remote-optgroup') {
    console.log('updating remote');
    updateRemote(title, fields);
    clearForm(updateForm);
    setTimeout(() => {
      updateSelect();
    }, 3000);
  }
});

const removeForm = document.querySelector('#remove-form');
removeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = removeForm.elements;
  const select = fields['select'];
  const option = select.options[select.selectedIndex];
  const title = option.value;
  const output = document.querySelector('#remove-output');
  if (title === '') {
    formError('Please select a project', output, select);
    return;
  }
  const optGroup = option.closest('optgroup').id;
  if (optGroup === 'remove-local-optgroup') {
    console.log('removing from local');
    removeLocal(title);
    updateSelect();
  } else if (optGroup === 'remove-remote-optgroup') {
    console.log('removing from remote');
    removeRemote(title);
    setTimeout(() => {
      updateSelect();
    }, 3000);
  }
});

async function getRemote() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`);
  const json = await res.json();
  const projects = json.record;
  return projects;
}

async function setRemote(projects) {
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': ACCESS_KEY
    },
    body: JSON.stringify(projects)
  });
}

async function createRemote(newProject) {
  const remoteProjects = await getRemote();
  remoteProjects.push(newProject);
  await setRemote(remoteProjects);
}

async function updateRemote(title, fields) {
  const projects = await getRemote();

  const index = projects.findIndex(p => p.title === title);
  const updatedProject = {
    'title': fields['title'].value,
    'img': fields['image'].value,
    'imgAlt': fields['image-alt'].value,
    'desc': fields['desc'].value,
    'link': fields['link'].value
  };

  projects[index] = {
    ...projects[index],
    ...updatedProject
  };

  await setRemote(projects);
}

async function removeRemote(title) {
  const projects = await getRemote();

  const updated = projects.filter(p => p.title !== title);

  await setRemote(updated);
}

clearForm(createForm);
clearForm(updateForm);
