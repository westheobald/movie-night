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
      <div class="sidebar__el sidebar__el--list sidebar__el--active" data-id="default" data-type="trending">
        Trending
      </div>
      <div class="sidebar__el sidebar__el--list" data-id="634" data-type="list">
        All Time Most Popular
      </div>
      <div class="sidebar__el sidebar__el--list" data-id="7094043" data-type="list">
        Wes' Favorites
      </div>
      <div class="sidebar__el sidebar__el--list" data-id="28" data-type="list">
        Academy Awards - Best Picture Winners
      </div>
      <div class="sidebar__el sidebar__el--list" data-id="28" data-type="genre">
        Action
      </div>
      <div class="sidebar__el sidebar__el--list" data-id="35" data-type="genre">
        Comedy
      </div>
      <div class="sidebar__el sidebar__el--list" data-id="18" data-type="genre">
        Drama
      </div>
      <div class="sidebar__el sidebar__el--list" data-id="27" data-type="genre">
        Horror
      </div>
      `;
    } else {
      return `
      <div class="sidebar__el" data-id="home" data-type="trending">
        <svg class="icon__home"><use xlink:href="src/img/sprites.svg#icon-home"></use></svg>
        Home
      </div>
      <div class="sidebar__el--blank">
        Searching for "${this._data.query}":
      </div>
      ${this._data.results
        .filter((el) => el.title)
        .map(this._generateMarkupMovie)
        .join('')}`;
    }
  }

  _generateMarkupMovie(movie) {
    console.log(movie);
    const movieTitleShort =
      movie.title.length > 50 ? movie.title.slice(0, 50) + '...' : movie.title;

    return `
      <div class="sidebar__el" data-id="${movie.id}">
      ${
        movie.poster_path
          ? `<img class="sidebar__poster" src="https://image.tmdb.org/t/p/w154${movie.poster_path}" />`
          : `<svg class="icon__missing"><use xlink:href="src/img/sprites.svg#icon-question"></use></svg>`
      }
        <div class="sidebar__details">
          <h3 class="sidebar__title">${movieTitleShort}</h3>
          <p>${movie.release_date.slice(0, 4)}</p>
        </div>
      </div>
    `;
  }
}

// ${
//   movie.vote_average
//     ? `<div class="sidebar__rating"><div class="stars__outer"><div class="stars__inner" data-rating="${movie.vote_average}"></div></div></div>`
//     : ''
// }

export default new SidebarView();
