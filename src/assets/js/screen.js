function init() {
  this.windowResize();
  window.addEventListener('resize', windowResize);
}

windowResize = function() {
  contentResize();
}

contentResize = function() {
/*
  var sideElement = document.querySelector("#content-side");

  var navbarElement = document.querySelector('.navbar');
  var navbarSecondaryElem = document.querySelector('.navbar-secondary');
  var footerElement = document.querySelector('footer');

  var bindingElements = navbarElement.offsetHeight + navbarSecondaryElem.offsetHeight + footerElement.offsetHeight;
  var spacing = 80;

  console.log(bindingElements)

  sideElement.style.height = window.innerHeight - bindingElements - spacing + 'px';
  sideElement.style.overflow = 'auto';
*/
}

window.onload = init;

