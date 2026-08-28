// --- MENÚ RESPONSIVO ---

// Buscamos en el documento los elementos que necesitamos:
let boton = document.getElementById('menu-respon');
let menu = document.getElementById('nav-menu');

// () => { ... } es una función flecha: "cuando ocurra el click, ejecutá esto".
boton.addEventListener('click', () => {
    // classList es la lista de clases CSS del elemento.
    // .toggle('active') funciona como un interruptor:
    // si la clase "active" no existe, la agrega; si ya existe, la quita.
    // El CSS se encarga de animar la apertura con max-height + opacity.
    const estaAbierto = menu.classList.toggle('active');
    boton.classList.toggle('activo', estaAbierto); // gira el ícono ☰
    boton.setAttribute('aria-expanded', estaAbierto);
});

// Mejora de UX en mobile: al tocar un link del menú, lo cerramos
// automáticamente para no taparle el contenido al usuario.
let enlaces = menu.querySelectorAll('a:not(.submenu > a)');
enlaces.forEach((enlace) => {
    enlace.addEventListener('click', () => {
        menu.classList.remove('active');
        boton.classList.remove('activo');
        boton.setAttribute('aria-expanded', 'false');
    });
});

// --- SUBMENÚS (Modalidades / Nosotros) ---
// En escritorio se abren con :hover (ver CSS), pero el celular no tiene
// hover real: hace falta un click/tap que agregue la clase "abierto" para
// que el submenú se despliegue (animado con max-height en el CSS).
const submenus = document.querySelectorAll('.submenu');
submenus.forEach((submenu) => {
    const link = submenu.querySelector('a');
    link.addEventListener('click', (evento) => {
        // El link apunta a "#" porque todavía no tiene una página propia,
        // así que evitamos que salte al inicio y en cambio desplegamos el submenú.
        evento.preventDefault();
        const yaEstabaAbierto = submenu.classList.contains('abierto');

        // Cerramos cualquier otro submenú abierto, para que no queden dos
        // desplegados a la vez.
        submenus.forEach((otro) => otro.classList.remove('abierto'));

        if (!yaEstabaAbierto) {
            submenu.classList.add('abierto');
        }
    });
});


// --- FILTRO DE CATEGORÍAS DEL MARKETPLACE
const chips = document.querySelectorAll('.filtro-chip');
const tarjetas = document.querySelectorAll('.tarjeta-producto');
const mensajeVacio = document.getElementById('market-vacio');

chips.forEach((chip) => {
    chip.addEventListener('click', () => {
        const categoriaElegida = chip.dataset.categoria;

        
        // Marcamos visualmente cuál chip está activo (aria-pressed además
        chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');

        let visibles = 0;

        tarjetas.forEach((tarjeta) => {
            const coincide =
                categoriaElegida === 'todos' ||
                tarjeta.dataset.categoria === categoriaElegida;

            if (coincide) {
                visibles++;
                tarjeta.style.display = 'flex';

                // display:flex antes de sacar la clase oculta y así el
                // fade cortito se note (si no, salta sin animar).
                void tarjeta.offsetWidth;
                tarjeta.classList.remove('oculta');
            } else {
                tarjeta.classList.add('oculta');
                tarjeta.style.display = 'none';
            }
        });

        // Si ninguna tarjeta coincide, mostramos un mensaje en vez de
        // dejar la grilla vacía sin explicación.
        if (mensajeVacio) {
            mensajeVacio.style.display = visibles === 0 ? 'block' : 'none';
        }
    });
});

// --- SCROLL REVEAL ---
// Cualquier elemento con la clase .reveal (por ahora, las columnas del
// footer) arranca invisible vía CSS. IntersectionObserver avisa cuando
// entra en pantalla y ahí le sumamos .visible, que dispara la transición.
const elementosReveal = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && elementosReveal.length) {
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    elementosReveal.forEach((el) => observador.observe(el));
} else {
    // Si el navegador no soporta IntersectionObserver, mostramos todo
    // directamente para no dejar contenido invisible.
    elementosReveal.forEach((el) => el.classList.add('visible'));
}
