function pageScreen() {
  window.addEventListener('load', contentResize);
  window.addEventListener('resize', contentResize);
}

function signinScreen() {
  signinBgResize();
  window.addEventListener('load', signinBgResize);
  window.addEventListener('resize', signinBgResize);
}

signinBgResize = function() {
  var bgCover = document.getElementById("bg-cover");
  if (bgCover) bgCover.style.height = window.innerHeight + 'px';
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

