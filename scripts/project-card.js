
document.querySelector('#load-remote').addEventListener('click', async () => {
  const res = await fetch('https://api.jsonbin.io/v3/b/693257c5ae596e708f848e4c');
  const json = await res.json();
  const data = json.record;
  renderCards(data);
});

function renderCards(projects) {
  const grid = document.querySelector('#project-showcase');
  grid.innerHTML = '';

  projects.forEach(p => {
    const card = document.createElement('project-card');

    card.setAttribute('title', p.title) || 'Untitled';
    card.setAttribute('img', p.img) || '';
    card.setAttribute('img-alt', p.imgAlt) || 'project image';
    card.setAttribute('desc', p.desc) || '';
    card.setAttribute('link', p.link) || '#';
    card.setAttribute('target', p.target) || '_blank';

    grid.appendChild(card);
  });
}

const localProjects = [
  {
    "title": "Typing Game",
    "img": "../images/typing-game-thumbnail",
    "imgAlt": "playing typing game",
    "desc": "Speed typing game made with React, Vite, and using the Quotable API. Gets a random quote for user to type has dynamic feedback for mistakes and keeps track of speed in WPM.",
    "link": "https://github.com/sebastian-dv/typing-game"
  },
  {
    "title": "Blackjack",
    "img": "../images/blackjack-thumbnail",
    "imgAlt": "playing blackjack",
    "desc": "Built a single-player GUI blackjack game using Java Swing. Implemented dealer logic and game state management with clear win/loss conditions.",
    "link": "https://github.com/sebastian-dv/blackjack"
  }
];
if (localStorage.getItem('projects') === '') {
  localStorage.setItem('projects', JSON.stringify(localProjects));
}

document.querySelector('#load-local').addEventListener('click', () => {
  const data = localStorage.getItem('projects');
  if (!data) {
    console.err('Local data not found');
    return;
  }
  const projects = JSON.parse(data);
  renderCards(projects);
});

class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static observedAttributes = ['title', 'img', 'img-alt', 'desc', 'link', 'target'];

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || 'Untitled';
    const img = this.getAttribute('img') || '';
    const imgAlt = this.getAttribute('img-alt') || '';
    const desc = this.getAttribute('desc') || '';
    const link = this.getAttribute('link') || '#';
    const target = this.getAttribute('target') || '_blank';

    const linkText = target === '_self' ? 'No Repo Available :(' : 'GitHub Repo';

    const srcsetWebp = `${img}-200.webp 200w, ${img}-400.webp 400w`;
    const srcsetJpeg = `${img}-200.jpeg 200w, ${img}-400.jpeg 400w`;
    const jpegImg = `${img}-400.jpeg`;

    let pictureHtml = '';
    if (img.startsWith('../images')) {
      pictureHtml = `
        <picture>
          <source type="image/webp" srcset="${srcsetWebp}">
          <source type="image/jpeg" srcset="${srcsetJpeg}">
          <img src="${jpegImg}" alt="${imgAlt}">
        </picture>
      `;
    } else {
      pictureHtml = `
        <picture>
          <img src="${img}" alt="${imgAlt}">
        </picture>
      `
    }

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        :host {
          max-width: 350px;
          width: 100%;
        }
        .card {
          border-radius: var(--border-radius);
          padding: 1.5rem;
          background-color: var(--card-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          picture {
            width: 90%;
            filter: drop-shadow(0 0 0.4rem #101010);
            img {
              width: 100%;
            }
          }
          h2 {
            color: var(--h2-color);
          }
          a {
            margin: 0 auto;
            padding: 0.6rem 1rem 0.3rem;
            color: var(--button-color);
            background-color: var(--button-bg-color);
            border-radius: var(--border-radius, 0.5rem);
            text-decoration: none;
          }
        }
      </style>
      <div class="card">
        ${pictureHtml}
        <h2>${title}</h2>
        <p>${desc}</p>
        <a href="${link}" target="${target}">${linkText}</a>
      </div>

    `;
  }
}

customElements.define("project-card", ProjectCard);
