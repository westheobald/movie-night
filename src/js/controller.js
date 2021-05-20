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
    await model.getMovie(movieID);
    mainView.render(model.state.movie);
  } catch (error) {
    mainView.renderError(error);
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
  showMovieList('trending', 'default');

  // handlers functions
  searchView.navButtons(searchView.toggleSidebar);
  searchView.searchSubmit(showSearch, searchView.toggleSidebar);
  sidebarView.addHandlerRenderMovies(renderSearch, showMovieList);
  mainView.addHandlerRenderMovies(renderSearch, updateBookmarks);
  mainView.addHandlerRenderSimilarMovie(showMovie);
  //CONTINUE HERE, REVIEW SIDEBAR VIEW
  // add short title to model and remove from sidebar and bookmarks
  watchLaterView.addHandlerRenderMovies(renderSearch, updateBookmarks);
}
init();
