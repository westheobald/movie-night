import View from './View.js';
import { getDate } from '../helpers.js';

class MainView extends View {
  _parentElement = document.querySelector('.main__content');

  addHandlerRenderMovies(handlerRenderSearch, handlerUpdateBookmarks) {
    this._parentElement.addEventListener('click', function (e) {
      if (e.target.closest('.btn__back')) {
        handlerRenderSearch('back');
      }

      if (e.target.closest('.btn__bookmark')) {
        handlerUpdateBookmarks(
          e.target.closest('.btn__bookmark').dataset.movie,
        );
      }

      // actor click, renders actor search in sidebar
      const crewElement = e.target.closest('li');
      if (crewElement) {
        if (crewElement.dataset.actor) {
          handlerRenderSearch(
            crewElement.dataset.actor,
            'actor',
            crewElement.dataset.name,
          );
        }
        if (crewElement.dataset.director) {
          handlerRenderSearch(
            crewElement.dataset.director,
            'director',
            crewElement.dataset.name,
          );
        }
      }
      if (!e.target.dataset.id) return;

      handlerRenderSearch(e.target.dataset.id, 'movie');
    });
  }

  addHandlerRenderSimilarMovie(handlerShowMovie) {
    this._parentElement.addEventListener('click', function (e) {
      if (e.target.closest('.similar__movie')) {
        handlerShowMovie(e.target.closest('.similar__movie').dataset.id);
      }
    });
  }

  _generateMarkup() {
    if (Array.isArray(this._data)) {
      return `<div class="movieList">${this._data
        .map(this._generateMarkupMovies)
        .join('')}</div>`;
    } else {
      return `
      ${
        document.querySelector('.sidebar__el--list')
          ? `
          <div class="btn__back">
            <svg class="icon--back icon-arrow-left">
              <use xlink:href="src/img/sprites.svg#icon-arrow-left"></use>
            </svg>
          </div>`
          : ``
      }

      ${
        this._data.title
          ? `
          <div class="movie__heading">
            <h1 class="movie__title">${this._data.title}</h1>
            <svg class="btn__bookmark" data-movie="${this._data.id}">
              <use xlink:href="src/img/sprites.svg#icon-bookmark"></use>
            </svg>
          </div>`
          : ''
      }
      <div class="movie__details"><p>${
        this._data.release ? getDate(this._data.release) : 'TBD'
      }<p>|</p><p>${
        this._data.runtime ? this._data.runtime : 'TBD'
      }</p><p>|</p></p><div class="stars__outer"><div class="stars__inner" data-rating="${
        this._data.rating
      }"></div></div>
      </div></div>
      <div class="movie__first">
      ${
        this._data.poster
          ? `<img class="movie__poster" src="${this._data.poster}" alt="${
              this._data.title ? this._data.title : ''
            }"/>`
          : ''
      }
      <div class="movie__info">
      ${
        this._data.tagline
          ? `<h2 class="movie__tagline">${this._data.tagline}</h2>`
          : ''
      }


      ${
        this._data.summary
          ? `<p class="movie__summary">${this._data.summary}</p>`
          : 'No information available at this time...'
      }</div></div>


      ${
        this._data.director
          ? `<div class="movie__directors"><strong>Director: </strong><ul>${this._data.director
              .map((dir) => this._generateMarkupCrew(dir))
              .join('')}</ul></div>`
          : ''
      }
      ${
        this._data.cast
          ? `<div class="movie__actors"><strong>Cast: </strong><ul>${this._data.cast
              .map((cast) => this._generateMarkupCrew(cast))
              .join('')}</ul></div>`
          : ''
      }
      

      ${
        this._data.genres
          ? `<p class="movie__genres"><strong>Genres: </strong>${this._data.genres
              .map((genre) => this._generateMarkupGenres(genre))
              .join(', ')}</p>`
          : ''
      }


      ${
        this._data.trailer
          ? `<div class="movie__trailer"><h3>Trailer:</h3><iframe width="560" height="315" src="${this._data.trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
          : ''
      }


      ${
        this._data.providers && this._data.providers.buy
          ? `<div class="movie__buy"><h3>Where to Buy:</h3><div class="providerLinks">${this._data.providers.buy
              .map((provider) => this._generateMarkupProvider(provider))
              .join('')}</div></div>`
          : ''
      }
      ${
        this._data.providers && this._data.providers.stream
          ? `<div class="movie__stream"><h3>Where to Stream:</h3><div class="providerLinks">${this._data.providers.stream
              .map((provider) => this._generateMarkupProvider(provider))
              .join('')}</div></div>`
          : ''
      }
      ${
        this._data.providers &&
        this._data.providers.rent &&
        JSON.stringify(this._data.providers.rent) !==
          JSON.stringify(this._data.providers.buy)
          ? `<div class="movie__rent"><h3>Where to Rent:</h3><div class="providerLinks">${this._data.providers.rent
              .map(this._generateMarkupProvider)
              .join('')}</div></div>`
          : ''
      }

      
      ${
        this._data.similar && this._data.similar.filter((el) => el).length
          ? `<div class="movie__similar"><h3>You Might Also Enjoy:</h3><div class="movie__similar__slider__container">${this._data.similar
              .map(this._generateMarkupSimilar)
              .join('')}</div></div>`
          : ''
      }`;
    }
  }

  _generateMarkupMovies(movie) {
    return `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" data-id="${movie.id}" />`;
  }
  _generateMarkupProvider(provider) {
    return `<div><img class="providerImage" src="https://image.tmdb.org/t/p/w500${provider.logo_path}"></div>`;
  }
  _generateMarkupCrew(crewMember) {
    if (crewMember.character) {
      return `<li class="crew__member" data-actor="${
        crewMember.id
      }" data-name="${crewMember.name}"><img class="crew__image" src="${
        crewMember.profile_path
          ? `https://image.tmdb.org/t/p/w154${crewMember.profile_path}`
          : ''
      }">${crewMember.name} as ${crewMember.character}</li>`;
    }
    // ADD ALTERNATE
    else
      return `<li class="crew__member" data-director="${
        crewMember.id
      }" data-name="${crewMember.name}"><img class="crew__image" src="${
        crewMember.profile_path
          ? `https://image.tmdb.org/t/p/w154${crewMember.profile_path}`
          : ''
      }">${crewMember.name}</li>`;
  }
  _generateMarkupGenres(genre) {
    return `<span class="genres" data-genre="${genre.id}">${genre.name}</span>`;
  }
  _generateMarkupSimilar(movie) {
    return `<div class="similar__movie" data-id="${movie.id}"><img class="similar__movie__img" src="https://image.tmdb.org/t/p/w154${movie.poster_path}" alt="${movie.title}"/><h4>${movie.title}</h4>
    <div class="stars__outer"><div class="stars__inner" data-rating="${movie.vote_average}"></div>
    </div></div>`;
  }
}

export default new MainView();
