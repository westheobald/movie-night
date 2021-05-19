import View from './View.js';

class SidebarView extends View {
  _parentElement = document.querySelector('.sidebar');

  addHandlerRenderMovies(renderSearch, showMovieList) {
    this._parentElement.addEventListener('click', function (e) {
      if (e.target.closest('.sidebar__el')) {
        const type = e.target.closest('.sidebar__el').dataset.type;
        const id = e.target.closest('.sidebar__el').dataset.id;
        _removeActiveClass();
        e.target.closest('.sidebar__el').classList.add('sidebar__el--active');
        if (e.target.closest('.sidebar__el').dataset.id === 'home') {
          showMovieList('trending', 'default');
        } else {
          renderSearch(id, type);
        }
      }

      function _removeActiveClass() {
        const parent = document.querySelector('.sidebar');
        const childs = [...parent.children];
        childs.forEach((child) =>
          child.classList.contains('sidebar__el--active')
            ? child.classList.remove('sidebar__el--active')
            : '',
        );
      }
    });
  }

  _generateMarkup() {
    if (this._data === 'default') {
      return `
      <div class="sidebar__el sidebar__el--active" data-id="default" data-type="trending">
        Trending
      </div>
      <div class="sidebar__el" data-id="7094043" data-type="list">
        Wes' Favorites
      </div>
      <div class="sidebar__el" data-id="28" data-type="genre">
        Action
      </div>
      <div class="sidebar__el" data-id="35" data-type="genre">
        Comedy
      </div>
      <div class="sidebar__el" data-id="18" data-type="genre">
        Drama
      </div>
      <div class="sidebar__el" data-id="27" data-type="genre">
        Horror
      </div>
      `;
    } else {
      // (Array.isArray(this._data.results))
      return `
      <div class="sidebar__el" data-id="home" data-type="trending">
        Home
      </div>
      <div class="sidebar__el--blank">
        Searching for "${this._data.query}"
      </div>
      ${this._data.results
        .filter((el) => el.title)
        .map(this._generateMarkupMovie)
        .join('')}`;
    }
  }

  _generateMarkupMovie(movie) {
    // ADD DEFAULT IMAGE TO FALSE CONDITION
    const moviePoster = movie.poster_path
      ? `src="https://image.tmdb.org/t/p/w154${movie.poster_path}"`
      : ``;
    const movieTitleShort =
      movie.title.length > 19 ? movie.title.slice(0, 19) + '...' : movie.title;

    return `
      <div class="sidebar__el" data-id="${movie.id}">
        <img
          class="search__poster"
          ${moviePoster}
        />
        <div class="search__details">
          <h3 class="search__title">${movieTitleShort}</h3>
          ${
            movie.vote_average
              ? `<div class="search__rating"><div class="stars__outer"><div class="stars__inner" data-rating="${movie.vote_average}"></div></div></div>`
              : ''
          }
        </div>
      </div>
    `;
  }
}

export default new SidebarView();
