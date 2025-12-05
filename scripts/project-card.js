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
    const imgAlt = this.getAttribute('img-alt') || 'project image';
    const desc = this.getAttribute('desc') || 'desc';
    const link = this.getAttribute('link') || '#';
    const target = this.getAttribute('target') || '_blank';
    const linkText = target === '_self' ? 'No Repo Available :(' : 'GitHub Repo';

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        :host {
          max-width: 350px;
          width: 100%;
          --button-bg-color: light-dark(#b16286, #d65d0e);
          --button-color: light-dark(white, #ebdbb2);
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
        <picture>
          <img src="${img}" alt="${imgAlt}">
        </picture>
        <h2>${title}</h2>
        <p>${desc}</p>
        <a href="${link}" target="${target}">${linkText}</a>
      </div>

    `;
  }
}

customElements.define("project-card", ProjectCard);
