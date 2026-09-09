document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('formInscripcion').addEventListener('submit', function(e) {
    e.preventDefault();

    const urlGApps = 'https://script.google.com/macros/s/AKfycbyP_PM4L9li3Mtax9xxV2xawt8zEZyOx3YqTRQ7s83tNsiFUJ3gRgHAHGiDoU5_QIcP7g/exec';
    const formData = new FormData(this);

    fetch(urlGApps, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      this.style.display = 'none';
      document.getElementById('mensajeExito').style.display = 'block';

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    }).catch(error => {
      console.error('Error:', error);
    });
  });
});