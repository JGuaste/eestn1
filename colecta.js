document.addEventListener('DOMContentLoaded', function () {

  // Reemplazá esta URL por la que te dio Google al implementar el Apps Script
  const urlGApps = 'https://script.google.com/macros/s/AKfycbxWEzS9IvUM_Ekyqzt5n2jypvLdYjGxwqXJbkSFeWaVBZG41_P9WoVHZ-_jE44joJmN2g/exec';

  const formulario = document.getElementById('formInscripcion');

  if (!formulario) {
    console.error('No se encontró el formulario con id="formInscripcion". Revisá que el id coincida con tu HTML.');
    return;
  }

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch(urlGApps, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      this.style.display = 'none';
      const mensajeExito = document.getElementById('mensajeExito');
      if (mensajeExito) {
        mensajeExito.style.display = 'block';
      }

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    })
    .catch(error => {
      console.error('Error al enviar el formulario:', error);
    });
  });

});