import * as model from './model.js';
import mainView from './views/mainView.js';
import sidebarView from './views/sidebarView.js';
import searchView from './views/searchView.js';
import watchLaterView from './views/watchLaterView.js';

async function initializeBookmarks() {
  if (!localStorage.bookmarks) return;
  model.state.watchLater = JSON.parse(localStorage.getItem('bookmarks'));
  watchLaterView.render(model.state.watchLater);
}

async function showActorSearch(actorID, query) {
  try {
    sidebarView.renderSpinner();
    await model.getActor(actorID, query);
    sidebarView.render(model.state.search);
  } catch (error) {
    sidebarView.renderError();
  }
}

async function showDirectorSearch(directorID, query) {
  try {
    sidebarView.renderSpinner();
    await model.getDirector(directorID, query);
    sidebarView.render(model.state.search);
  } catch (error) {
    sidebarView.renderError();
  }
}

async function updateBookmarks(movieID, maintainSidebar) {
  await model.addWatchLater(movieID);
  watchLaterView.render(model.state.watchLater);
  watchLaterView.toggleSidebar('bookmarks', maintainSidebar);
}

async function showSearch(page = 1) {
  try {
    const query = searchView.getQuery();
    sidebarView.renderSpinner();
    await model.getSearch(query, page);
    sidebarView.render(model.state.search);
  } catch (error) {
    sidebarView.renderError();
  }
}
function renderSearch(id, type, query) {
  if (id === 'back') {
    sidebarView.toggleSidebar('sidebar', false);
    return showMovieList();
  }
  if (id && !type) {
    sidebarView.toggleSidebar(
      query === 'bookmarks' ? 'bookmarks' : 'sidebar',
      false,
    );
    return showMovie(id);
  }
  if (type === 'movie') {
    return showMovie(id);
  }
  // renders previous list if no arguments
  // used for back button
  if (!id && !type) {
    sidebarView.toggleSidebar('sidebar', false);
    return showMovieList();
  }

  if (type === 'actor') {
    sidebarView.toggleSidebar('sidebar', true);
    return showActorSearch(id, query);
  }
  if (type === 'director') {
    sidebarView.toggleSidebar('sidebar', true);
    return showDirectorSearch(id, query);
  }
  if (type) {
    sidebarView.toggleSidebar('sidebar', false);
    return showMovieList(type, id);
  }
}

async function showMovieList(type, id) {
  try {
    mainView.renderSpinner();
    window.location.hash = `${type}-${id}`;
    document.title = `Movie Night | What to watch...`;
    if (id === 'default') {
      sidebarView.render('default');
    }
    if (type && id) {
      await model.getMovieTiles(type, id);
    }
    mainView.render(model.state.movieList);
  } catch (error) {
    mainView.renderError();
  }
}
async function showMovie(movieID) {
  try {
    mainView.renderSpinner();
    window.location.hash = `${movieID}`;
    await model.getMovie(movieID);
    document.title = `Movie Night | ${model.state.movie.title}`;
    mainView.render(model.state.movie);
  } catch (error) {
    mainView.renderError(error);
  }
}

function renderHash() {
  if (location.hash) {
    const hash = location.hash.slice(1);

    if (hash) {
      if (hash.includes('-')) {
        const type = hash.split('-')[0];
        const id = hash.split('-')[1];
        console.log(type, id);
        showMovieList(type, id);
      } else {
        showMovie(hash);
      }
    }
  } else {
    showMovieList('trending', 'default');
  }
}

function init() {
  // 100vh fix for mobile browsers
  window.onload = window.onresize = function () {
    const body = document.querySelector('body');
    const height = window.innerHeight;
    body.style.height = height + 'px';
  };

  // initial functions
  initializeBookmarks();
  renderHash();

  // handlers functions
  searchView.navButtons(searchView.toggleSidebar);
  searchView.searchSubmit(showSearch, searchView.toggleSidebar);
  sidebarView.addHandlerRenderMovies(renderSearch, showMovieList);
  mainView.addHandlerRenderMovies(renderSearch, updateBookmarks);
  mainView.addHandlerRenderSimilarMovie(showMovie);
  mainView.addHandlerRenderURLChange(renderHash);
  watchLaterView.addHandlerRenderMovies(renderSearch, updateBookmarks);
}
init();
