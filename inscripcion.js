// Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {

  // Selección de elementos del DOM relacionados con el año y la modalidad
  const selectAnio = document.getElementById('anio');
  const grupoModalidad = document.getElementById('grupo-modalidad');
  const selectModalidad = document.getElementById('modalidad');

  // Evento para mostrar u ocultar el campo de modalidad según el año seleccionado
  selectAnio.addEventListener('change', function () {
    if (this.value === '4to año') {
      grupoModalidad.style.display = 'block'; // Muestra el contenedor de modalidad
      selectModalidad.required = true;       // Hace que el select sea obligatorio
    } else {
      grupoModalidad.style.display = 'none'; // Oculta el contenedor de modalidad
      selectModalidad.required = false;      // Quita la obligatoriedad
      selectModalidad.value = '';            // Limpia la selección previa
    }
  });

  // Evento que maneja el envío del formulario de inscripción
  document.getElementById('formInscripcion').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío tradicional de la página para controlarlo mediante script

    const urlBase = 'https://script.google.com/macros/s/AKfycbyg2t-iD_MmemSZIoyrtNFVSZ6Wm4l093vlDVjWWf7XJ9orgdRbyjdkH9LcWotedbr0/exec';
    const formData = new FormData(this);
    const params = new URLSearchParams(formData);

    // Genera un nombre de función de callback único basado en la marca de tiempo (para JSONP)
    const callbackName = 'jsonpCallback_' + Date.now();
    params.set('callback', callbackName);

    const formulario = this;

    // Define la función global que manejará la respuesta enviada por Google Apps Script
    window[callbackName] = function(data) {
      // Limpieza: elimina la función global creada y remueve la etiqueta de script del DOM
      delete window[callbackName];
      document.body.removeChild(scriptTag);

      // Valida si el servidor devuelve que el cupo está completo
      if (data.result === 'cupo_lleno') {
        alert('Lo sentimos, el cupo para la modalidad "' + data.modalidad + '" ya está completo.');
        return;
      }
      
      // Valida si ocurrió un error en el servidor
      if (data.result === 'error') {
        alert('Hubo un error al enviar. Probá de nuevo.');
        console.error(data.error);
        return;
      }

      // Si el envío es exitoso, oculta el formulario y muestra el mensaje de éxito
      formulario.style.display = 'none';
      document.getElementById('mensajeExito').style.display = 'block';
      
      // Redirige al usuario a la página de inicio después de 3 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    };

    // Creación dinámica de una etiqueta <script> para hacer la petición cruzada (JSONP) evitando restricciones de CORS
    const scriptTag = document.createElement('script');
    scriptTag.src = urlBase + '?' + params.toString();
    document.body.appendChild(scriptTag);
  });

});