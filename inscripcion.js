// Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {

  // Selección de elementos del DOM relacionados con el año y la modalidad
  const selectAnio = document.getElementById('anio');
  const grupoModalidad = document.getElementById('grupo-modalidad');
  const selectModalidad = document.getElementById('modalidad');
  const formInscripcion = document.getElementById('formInscripcion');

  // Busca un campo del formulario por id o por name (por si alguno difiere)
  function obtenerCampo(nombre) {
    return formInscripcion.querySelector('#' + nombre + ', [name="' + nombre + '"]');
  }

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

  // ---------- Filtros en tiempo real mientras se escribe ----------

  // DNI y teléfono: solo números
  ['dni', 'telefono'].forEach(function (nombre) {
    const campo = obtenerCampo(nombre);
    if (!campo) return;
    campo.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, ''); // elimina todo lo que no sea número
    });
  });

  // Nombre y apellido: solo letras, espacios y apóstrofes
  const campoNombre = obtenerCampo('nombre');
  if (campoNombre) {
    campoNombre.addEventListener('input', function () {
      this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g, '');
    });
  }

  // ---------- Validación completa antes de enviar ----------

  // Devuelve un mensaje de error si algo está mal, o null si todo es válido
  function validarFormulario(form) {
    const valor = function (nombre) {
      const campo = obtenerCampo(nombre);
      return campo ? campo.value.trim() : '';
    };

    const nombre   = valor('nombre');
    const dni      = valor('dni');
    const telefono = valor('telefono');
    const email    = valor('email');
    const escuela  = valor('escuela');
    const anio     = selectAnio.value;

    if (nombre.length < 3 || !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/.test(nombre)) {
      return 'Ingresá un nombre y apellido válido (solo letras).';
    }
    if (!/^[0-9]{7,8}$/.test(dni)) {
      return 'El DNI debe tener 7 u 8 números, sin puntos.';
    }
    if (!/^[0-9]{10}$/.test(telefono)) {
      return 'El teléfono debe tener 10 números, sin 0 ni 15.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Ingresá un correo electrónico válido.';
    }
    if (!anio) {
      return 'Seleccioná el año al que ingresa.';
    }
    if (anio === '4to año' && !selectModalidad.value) {
      return 'Seleccioná una modalidad.';
    }
    if (escuela.length < 3) {
      return 'Indicá la escuela de la que venís.';
    }
    return null; // todo OK
  }

  // Evento que maneja el envío del formulario de inscripción
  formInscripcion.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío tradicional de la página para controlarlo mediante script

    // Si algún dato no es válido, se avisa y no se envía nada
    const errorValidacion = validarFormulario(this);
    if (errorValidacion) {
      alert(errorValidacion);
      return;
    }

    const urlBase = 'https://script.google.com/macros/s/AKfycbyg2t-iD_MmemSZIoyrtNFVSZ6Wm4l093vlDVjWWf7XJ9orgdRbyjdkH9LcWotedbr0/exec';
    const formData = new FormData(this);

    // Limpia espacios al inicio y al final de todos los valores de texto
    formData.forEach(function (valor, clave) {
      if (typeof valor === 'string') formData.set(clave, valor.trim());
    });

    const params = new URLSearchParams(formData);

    // Genera un nombre de función de callback único basado en la marca de tiempo (para JSONP)
    const callbackName = 'jsonpCallback_' + Date.now();
    params.set('callback', callbackName);

    const formulario = this;
    const boton = formulario.querySelector('.btn-enviar');
    const textoOriginalBoton = boton.textContent;

    // Desactiva el botón mientras se espera la respuesta, para dar feedback y evitar envíos duplicados
    boton.disabled = true;
    boton.textContent = 'Enviando…';

    let finalizado = false;

    // Limpia la petición y, si se indica, vuelve a habilitar el botón para reintentar
    function finalizar(rehabilitarBoton) {
      finalizado = true;
      clearTimeout(timeoutId);
      window[callbackName] = function() {}; // Ignora respuestas que lleguen tarde
      if (scriptTag.parentNode) scriptTag.parentNode.removeChild(scriptTag);
      if (rehabilitarBoton) {
        boton.disabled = false;
        boton.textContent = textoOriginalBoton;
      }
    }

    // Si no hay respuesta en 15 segundos, se avisa al usuario y se permite reintentar
    const timeoutId = setTimeout(function() {
      if (finalizado) return;
      finalizar(true);
      alert('El servidor está tardando demasiado en responder. Revisá tu conexión y probá de nuevo.');
    }, 15000);

    // Define la función global que manejará la respuesta enviada por Google Apps Script
    window[callbackName] = function(data) {
      if (finalizado) return;

      // Valida si el servidor devuelve que el cupo está completo
      if (data.result === 'cupo_lleno') {
        finalizar(true);
        alert('Lo sentimos, el cupo para la modalidad "' + data.modalidad + '" ya está completo.');
        return;
      }

      // Valida si ocurrió un error en el servidor
      if (data.result === 'error') {
        finalizar(true);
        alert('Hubo un error al enviar. Probá de nuevo.');
        console.error(data.error);
        return;
      }

      finalizar(false);

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

    // Si la petición falla (sin conexión, script caído, etc.) se avisa y se permite reintentar
    scriptTag.onerror = function() {
      if (finalizado) return;
      finalizar(true);
      alert('No se pudo enviar la preinscripción. Revisá tu conexión y probá de nuevo.');
    };

    document.body.appendChild(scriptTag);
  });
});
