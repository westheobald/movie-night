import { getJSON, locale } from './helpers.js';
import { API_KEY } from './config.js';

export const state = {
  movieList: {},
  movie: {},
  search: {
    query: '',
    results: [],
    page: 1,
  },
  watchLater: [],
};

export const getMovieTiles = async function (type, id) {
  try {
    if (Object.prototype.hasOwnProperty.call(state, id)) {
      state.movieList = state[id];
      return;
    }
    if (type === 'list') {
      const url = `https://api.themoviedb.org/3/list/${id}?api_key=${API_KEY}&language=en-US`;

      const data = await getJSON(url);
      state.movieList = data.items;
      return (state[id] = state.movieList);
    }
    if (type === 'trending') {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

      const data = await getJSON(url);
      state.movieList = data.results;
      return (state[id] = state.movieList);
    }
    if (type === 'genre') {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}`;

      const data = await getJSON(url);
      state.movieList = data.results;
      return (state[id] = state.movieList);
    }
  } catch (error) {
    throw error;
  }
};

export const getSearch = async function (searchQuery, page = 1) {
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchQuery}&page=${page}&include_adult=false`;

    const data = await getJSON(url);
    data.query = searchQuery;

    state.search.query = searchQuery;
    state.search.page = data.page;
    state.search.results = data.results;
  } catch (error) {
    throw error;
  }
};

export const getMovie = async function (movieID) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}&language=en-US&append_to_response=videos,watch/providers,similar,credits`;
    const data = await getJSON(url);
    state.movie = {};

    if (data.id) {
      state.movie.id = data.id;
    }

    if (Array.isArray(data.genres) && data.genres.length) {
      state.movie.genres = data.genres;
    }

    if (data.credits.cast) {
      data.credits.cast.length > 6 ? (data.credits.cast.length = 6) : '';
      state.movie.cast = data.credits.cast;
    }

    if (data.credits.crew) {
      state.movie.director = data.credits.crew.filter(
        (crewMem) => crewMem.job === 'Director',
      );
    }

    if (data.similar.results) {
      if (data.similar.results.filter((el) => el).length) {
        data.similar.results.length = 12;
        data.similar.results.sort((a, b) => b.vote_average - a.vote_average);
        state.movie.similar = data.similar.results;
      }
    }

    if (data.release_date) {
      state.movie.release = new Date(data.release_date);
    }

    if (data.title) {
      state.movie.title = data.title;
    }

    if (data.tagline) {
      state.movie.tagline = data.tagline;
    }

    if (data.overview) {
      state.movie.summary = data.overview;
    }

    if (data.vote_average) {
      state.movie.rating = data.vote_average;
    }

    if (data.poster_path) {
      state.movie.poster = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    }

    if (data.runtime) {
      const hours = data.runtime / 60;
      const hoursRounded = Math.floor(hours);
      const minutes = (hours - hoursRounded) * 60;
      const minutesRounded = Math.round(minutes);
      state.movie.runtime = `${hoursRounded} ${
        hoursRounded > 1 ? 'hours' : 'hour'
      } ${minutesRounded} min`;
    }

    if (Array.isArray(data.videos.results) && data.videos.results.length) {
      state.movie.trailer = `https://www.youtube.com/embed/${data.videos.results[0].key}`;
    }

    if (data['watch/providers'].results[locale]) {
      const localProviders = data['watch/providers'].results[locale];
      state.movie.providers = {};
      if (localProviders.buy) {
        state.movie.providers.buy = localProviders.buy;
      }
      if (localProviders.flatrate) {
        state.movie.providers.stream = localProviders.flatrate;
      }
      if (localProviders.rent) {
        state.movie.providers.rent = localProviders.rent;
      }
    }
  } catch (error) {
    throw error;
  }
};

export const getActor = async function (actorID, query) {
  try {
    const url = `https://api.themoviedb.org/3/person/${actorID}/movie_credits?api_key=${API_KEY}&language=en-US`;
    const data = await getJSON(url);
    state.search.query = query;
    state.search.results = data.cast;
    state.search.results = state.search.results.filter(
      (el) => el.vote_count > 20,
    );
    state.search.results.sort((a, b) => b.vote_average - a.vote_average);
  } catch (error) {
    throw error;
  }
};

export const getDirector = async function (directorID, query) {
  try {
    const url = `https://api.themoviedb.org/3/person/${directorID}/combined_credits?api_key=${API_KEY}`;
    const data = await getJSON(url);
    state.search.query = query;
    state.search.results = data.crew
      .filter((el) => el.vote_count > 20 && el.job === 'Director')
      .sort((a, b) => b.vote_average - a.vote_average);
  } catch (error) {
    throw error;
  }
};

export const getGenre = async function (genreID) {
  try {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1&with_genres=${genreID}`;
    const data = await getJSON(url);

    state.search.query = genreID;
    state.search.page = data.page;
    state.search.results = data.results;
  } catch (error) {
    throw error;
  }
};

export const addWatchLater = async function (movieID) {
  try {
    const index = state.watchLater.findIndex((movie) => +movieID === movie.id);
    if (index === -1) {
      const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}&language=en-US&append_to_response=videos,watch/providers,similar,credits`;
      const data = await getJSON(url);
      state.watchLater.push(data);
    } else {
      state.watchLater.splice(index, 1);
    }
    if (state.watchLater.length > 0) {
      localStorage.setItem('bookmarks', JSON.stringify(state.watchLater));
    } else {
      localStorage.removeItem('bookmarks');
    }
  } catch (error) {
    throw error;
  }
};
