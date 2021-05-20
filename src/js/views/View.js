export default class View {
  _data;

  render(data) {
    if (!data) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    console.log(data);
    if (data.rating) {
      this._addStarsRating();
    }
  }

  _addStarsRating() {
    const ratings = document.querySelectorAll('.stars__inner');
    ratings.forEach(function (element) {
      const ratingPercent = element.dataset.rating * 10 + '%';
      element.style.width = ratingPercent;
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(error = this._errorMessage) {
    const markup = `
    <div class="error">
      <p>${error}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
      <svg class="icon__loading">
        <use xlink:href="src/img/sprites.svg#icon-spinner"></use>
      </svg>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  toggleSidebar(el, openSidebar) {
    const element = document.querySelector(`.${el}`);
    const iconDefault = el === 'sidebar' ? 'menu' : 'bookmark';
    const iconNew = el === 'sidebar' ? 'icon__menu' : 'icon__bookmark';
    if (openSidebar === true) {
      return open();
    } else if (openSidebar === false) {
      return close();
    }

    if (element.dataset.on === '0') {
      return open();
    } else if (element.dataset.on === '1') {
      return close();
    }

    function open() {
      element.style.width = '100%';
      element.setAttribute('data-on', '1');
      document.querySelector(`.${iconNew}`).innerHTML = `
        <use xlink:href="src/img/sprites.svg#icon-cross"></use>
      `;
      document.querySelector('.main').style.opacity = '0';
      document.querySelector('.main').style.transitionDelay = '0s';
    }
    function close() {
      element.style.width = '0';
      element.setAttribute('data-on', '0');
      document.querySelector(`.${iconNew}`).innerHTML = `
      <use xlink:href="src/img/sprites.svg#icon-${iconDefault}"></use>
      `;
      document.querySelector('.main').style.opacity = '1';
      document.querySelector('.main').style.transitionDelay = '.6s';
    }
  }
}
