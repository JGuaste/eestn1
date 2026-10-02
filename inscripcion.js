document.addEventListener('DOMContentLoaded', function () {

  const selectAnio = document.getElementById('anio');
  const grupoModalidad = document.getElementById('grupo-modalidad');
  const selectModalidad = document.getElementById('modalidad');

  selectAnio.addEventListener('change', function () {
    if (this.value === '3er año') {
      grupoModalidad.style.display = 'block';
      selectModalidad.required = true;
    } else {
      grupoModalidad.style.display = 'none';
      selectModalidad.required = false;
      selectModalidad.value = '';
    }
  });

  document.getElementById('formInscripcion').addEventListener('submit', function(e) {
    e.preventDefault();

    const urlBase = 'https://script.google.com/macros/s/AKfycbyP_PM4L9li3Mtax9xxV2xawt8zEZyOx3YqTRQ7s83tNsiFUJ3gRgHAHGiDoU5_QIcP7g/exec';
    const formData = new FormData(this);
    const params = new URLSearchParams(formData);

    const callbackName = 'jsonpCallback_' + Date.now();
    params.set('callback', callbackName);

    const formulario = this;

    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(scriptTag);

      if (data.result === 'cupo_lleno') {
        alert('Lo sentimos, el cupo para la modalidad "' + data.modalidad + '" ya está completo.');
        return;
      }
      if (data.result === 'error') {
        alert('Hubo un error al enviar. Probá de nuevo.');
        console.error(data.error);
        return;
      }

      formulario.style.display = 'none';
      document.getElementById('mensajeExito').style.display = 'block';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    };

    const scriptTag = document.createElement('script');
    scriptTag.src = urlBase + '?' + params.toString();
    document.body.appendChild(scriptTag);
  });

});