export default class View {
  _data;

  render(data) {
    if (!data) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    // WHAT IS THIS
    if (typeof this._addStarsRating === 'function') this._addStarsRating();
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

    if (openSidebar === true || element.dataset.on === '0') {
      element.style.width = '100%';
      element.setAttribute('data-on', '1');
      document.querySelector(`.${iconNew}`).innerHTML = `
        <use xlink:href="src/img/sprites.svg#icon-cross"></use>
      `;
      document.querySelector('.main').style.opacity = '0';
      document.querySelector('.main').style.transitionDelay = '0s';
    } else if (element.dataset.on === '1' || openSidebar === false) {
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
