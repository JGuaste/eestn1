(() => {
  "use strict";

  const CLAVE_CARRITO = "tecnomarket-carrito";
  const WHATSAPP = "5492364321784";

  function leerCarrito() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");
      return Array.isArray(guardado) ? guardado : [];
    } catch {
      return [];
    }
  }

  function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }

  function formatoPesos(valor) {
    return `$ ${Number(valor || 0).toLocaleString("es-AR")}`;
  }

  function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    const enlace = document.querySelector(".enlace-carrito");
    const cantidad = leerCarrito().reduce((suma, item) => suma + Number(item.cantidad || 0), 0);
    if (contador) contador.textContent = cantidad;
    enlace?.setAttribute("aria-label", `Carrito: ${cantidad} productos`);
  }

  function animarContador() {
    const contador = document.getElementById("contador-carrito");
    if (!contador || !contador.animate) return;
    contador.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.45)" }, { transform: "scale(1)" }],
      { duration: 420, easing: "ease-out" }
    );
  }

  function agregarProducto(boton) {
    const id = boton.dataset.id;
    const nombre = boton.dataset.nombre?.trim();
    const precio = Number(boton.dataset.precio);
    if (!id || !nombre || !Number.isFinite(precio) || precio < 0) return;

    const carrito = leerCarrito();
    const tarjeta = boton.closest(".tarjeta-producto");
    const imagen = tarjeta?.querySelector(".producto img")?.getAttribute("src") || "";
    const existente = carrito.find(item => item.id === id);

    if (existente) {
      existente.cantidad = Number(existente.cantidad || 0) + 1;
      existente.imagen ||= imagen;
      existente.seleccionado = existente.seleccionado !== false;
    } else {
      carrito.push({ id, nombre, precio, cantidad: 1, imagen, seleccionado: true });
    }

    guardarCarrito(carrito);
    actualizarContador();
    animarContador();

    const mensaje = tarjeta?.querySelector(".mensaje-producto");
    if (mensaje) {
      mensaje.textContent = `${nombre} agregado al carrito`;
      clearTimeout(mensaje._temporizador);
      mensaje._temporizador = setTimeout(() => { mensaje.textContent = ""; }, 3000);
    }
  }

  const lista = document.getElementById("productos-carrito");
  const totalProductos = document.getElementById("subtotal-carrito");
  const totalGeneral = document.getElementById("total-carrito");
  const cantidadSeleccionada = document.getElementById("cantidad-seleccionada");
  const seleccionarTodos = document.getElementById("seleccionar-todos");
  const botonContinuar = document.getElementById("continuar-compra");
  const botonCompartir = document.getElementById("compartir-carrito");

  function renderizarCarrito() {
    if (!lista) return;
    const carrito = leerCarrito();
    lista.replaceChildren();

    if (carrito.length === 0) {
      const vacio = document.createElement("div");
      vacio.className = "carrito-vacio";
      vacio.innerHTML = '<p>Tu carrito está vacío.</p><a href="marketplace.html">Ver productos</a>';
      lista.append(vacio);
    } else {
      carrito.forEach(item => {
        const fila = document.createElement("article");
        fila.className = "producto";

        const check = document.createElement("input");
        check.className = "check-producto";
        check.type = "checkbox";
        check.checked = item.seleccionado !== false;
        check.dataset.accion = "seleccionar";
        check.dataset.id = item.id;
        check.setAttribute("aria-label", `Seleccionar ${item.nombre}`);

        const imagen = document.createElement("img");
        imagen.className = "producto-imagen";
        imagen.src = item.imagen || "imagenes/Logo.png";
        imagen.alt = item.nombre;
        imagen.addEventListener("error", () => { imagen.src = "imagenes/Logo.png"; }, { once: true });

        const info = document.createElement("div");
        info.className = "producto-info";
        const tituloFila = document.createElement("div");
        tituloFila.className = "producto-titulo-fila";
        const titulo = document.createElement("h2");
        titulo.textContent = item.nombre;
        const quitar = document.createElement("button");
        quitar.className = "eliminar";
        quitar.type = "button";
        quitar.textContent = "×";
        quitar.title = "Quitar producto";
        quitar.dataset.accion = "eliminar";
        quitar.dataset.id = item.id;
        tituloFila.append(titulo, quitar);

        const acciones = document.createElement("div");
        acciones.className = "producto-acciones";
        const cantidad = document.createElement("div");
        cantidad.className = "cantidad";
        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "−";
        menos.setAttribute("aria-label", "Quitar una unidad");
        menos.dataset.accion = "menos";
        menos.dataset.id = item.id;
        const numero = document.createElement("span");
        numero.textContent = item.cantidad;
        const mas = document.createElement("button");
        mas.type = "button";
        mas.textContent = "+";
        mas.setAttribute("aria-label", "Agregar una unidad");
        mas.dataset.accion = "mas";
        mas.dataset.id = item.id;
        cantidad.append(menos, numero, mas);
        acciones.append(cantidad);
        info.append(tituloFila, acciones);

        const precio = document.createElement("strong");
        precio.className = "producto-precio";
        precio.textContent = formatoPesos(Number(item.precio) * Number(item.cantidad));
        fila.append(check, imagen, info, precio);
        lista.append(fila);
      });
    }

    const seleccionados = carrito.filter(item => item.seleccionado !== false);
    const subtotal = seleccionados.reduce((suma, item) => suma + Number(item.precio) * Number(item.cantidad), 0);
    const unidades = seleccionados.reduce((suma, item) => suma + Number(item.cantidad), 0);
    if (totalProductos) totalProductos.textContent = formatoPesos(subtotal);
    if (totalGeneral) totalGeneral.textContent = formatoPesos(subtotal);
    if (cantidadSeleccionada) cantidadSeleccionada.textContent = unidades;
    if (seleccionarTodos) {
      seleccionarTodos.checked = carrito.length > 0 && carrito.every(item => item.seleccionado !== false);
      seleccionarTodos.indeterminate = carrito.some(item => item.seleccionado === false) && seleccionados.length > 0;
    }
    if (botonContinuar) botonContinuar.disabled = unidades === 0;
  }

  document.addEventListener("click", evento => {
    const boton = evento.target.closest(".btn-carrito");
    if (boton) agregarProducto(boton);
  });

  lista?.addEventListener("change", evento => {
    const check = evento.target.closest('[data-accion="seleccionar"]');
    if (!check) return;
    const carrito = leerCarrito();
    const item = carrito.find(producto => producto.id === check.dataset.id);
    if (item) item.seleccionado = check.checked;
    guardarCarrito(carrito);
    renderizarCarrito();
  });

  lista?.addEventListener("click", evento => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const carrito = leerCarrito();
    const item = carrito.find(producto => producto.id === boton.dataset.id);
    if (!item) return;

    if (boton.dataset.accion === "mas") item.cantidad = Number(item.cantidad) + 1;
    if (boton.dataset.accion === "menos") item.cantidad = Number(item.cantidad) - 1;
    if (boton.dataset.accion === "eliminar" || item.cantidad <= 0) {
      carrito.splice(carrito.indexOf(item), 1);
    }
    guardarCarrito(carrito);
    actualizarContador();
    renderizarCarrito();
  });

  seleccionarTodos?.addEventListener("change", () => {
    const carrito = leerCarrito().map(item => ({ ...item, seleccionado: seleccionarTodos.checked }));
    guardarCarrito(carrito);
    renderizarCarrito();
  });

  botonContinuar?.addEventListener("click", () => {
    const seleccionados = leerCarrito().filter(item => item.seleccionado !== false);
    if (!seleccionados.length) return;
    const lineas = seleccionados.map(item =>
      `• ${item.nombre} x ${item.cantidad}: ${formatoPesos(Number(item.precio) * Number(item.cantidad))}`
    );
    const total = seleccionados.reduce((suma, item) => suma + Number(item.precio) * Number(item.cantidad), 0);
    const mensaje = `Hola, quiero hacer este pedido:\n${lineas.join("\n")}\nTotal productos: ${formatoPesos(total)}\n\n¿Podemos coordinar la entrega?`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
  });

  botonCompartir?.addEventListener("click", async () => {
    const url = new URL("marketplace.html", window.location.href).href;
    const carrito = leerCarrito();
    const total = carrito.reduce((suma, item) => suma + Number(item.precio) * Number(item.cantidad), 0);
    const detalle = carrito.map(item => `• ${item.nombre} x ${item.cantidad}`).join("\n");
    const texto = `Mi carrito de la E.E.S.T. N°1:\n${detalle || "Todavía está vacío."}\nTotal: ${formatoPesos(total)}\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mi carrito - E.E.S.T. N°1", text: texto, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texto);
        botonCompartir.lastChild.textContent = " Enlace copiado";
        setTimeout(() => { botonCompartir.lastChild.textContent = " Compartir carrito"; }, 2200);
      } else {
        window.prompt("Copiá el enlace del carrito:", url);
      }
    } catch (error) {
      if (error.name !== "AbortError") window.prompt("Copiá el enlace del carrito:", url);
    }
  });

  actualizarContador();
  renderizarCarrito();
})();
