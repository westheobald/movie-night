import View from './View.js';

class SearchView extends View {
  _parentElement = document.querySelector('.nav');

  _clearInput(el) {
    el.value = '';
  }

  getQuery() {
    const searchField = document.querySelector('.search__field');
    const query = searchField.value;
    this._clearInput(searchField);
    return query;
  }

  navButtons(handlerToggleSidebar) {
    this._parentElement.addEventListener('click', function (e) {
      if (e.target.closest('.icon__menu')) {
        handlerToggleSidebar('sidebar');
      }
      if (e.target.closest('.icon__bookmark')) {
        handlerToggleSidebar('bookmarks');
      }
    });
  }

  searchSubmit(handlerShowSearch, handlerToggleSidebar) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handlerShowSearch();
      handlerToggleSidebar('sidebar', true);
    });
  }
}

export default new SearchView();
