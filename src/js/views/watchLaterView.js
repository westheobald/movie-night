import View from './View.js';

class WatchLaterView extends View {
  _parentElement = document.querySelector('.bookmarks');

  addHandlerRenderMovies(handlerRenderSearch, handlerUpdateBookmarks) {
    this._parentElement.addEventListener('click', function (e) {
      if (e.target.closest('.icon__remove')) {
        return handlerUpdateBookmarks(
          e.target.closest('.sidebar__el').dataset.id,
          true,
        );
      } else if (e.target.closest('.sidebar__el')) {
        handlerRenderSearch(
          e.target.closest('.sidebar__el').dataset.id,
          undefined,
          'bookmarks',
        );
      }
    });
  }

  _generateMarkup() {
    // this._data.filter(el => el.title);
    return `${this._data.map(this._generateMarkupMovie).join('')}`;
  }

  _generateMarkupMovie(movie) {
    // ADD DEFAULT IMAGE TO FALSE CONDITION
    const moviePosterURL = movie.poster_path
      ? `src="https://image.tmdb.org/t/p/w154${movie.poster_path}"`
      : ``;
    const movieTitleShort =
      movie.title.length > 50 ? movie.title.slice(0, 50) + '...' : movie.title;

    return `
    <div class="sidebar__el" data-id="${movie.id}">
      <svg class="icon__remove">
        <use xlink:href="src/img/sprites.svg#icon-cross"></use>
      </svg>
      <img
        class="bookmarks__poster"
        ${moviePosterURL}
      />
      <div class="bookmarks__details">
        <h3>${movieTitleShort}</h3>
        <div class="stars__outer">
          <div class="stars__inner" data-rating="${movie.vote_average}"></div>
        </div>
      </div>
    </div>`;
  }
}

export default new WatchLaterView();
