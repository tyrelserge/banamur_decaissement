
window.addEventListener('load', () => {

  var promptEvent;
  var btn = document.getElementById('pwa-install-button');

  window.addEventListener('beforeinstallprompt', (event) => {

    promptEvent = event;

    if (btn) btn.addEventListener('click', () => {
      if (promptEvent) {
        promptEvent.prompt();
        promptEvent.userChoice.then((result) => {
          if (result.outcome === 'accepted') {
            btn.style.display = 'none';
          }
          promptEvent = undefined;
        });
      }
    });
  });

  // Hide the install button
  window.addEventListener('appinstalled', (evt) => {
    var btn = document.getElementById('pwa-install-button');
    btn.style.display = 'none';
    promptEvent = null;
  });

});



