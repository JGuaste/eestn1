// --- MENÚ MÓVIL ---
// Buscamos en el documento los elementos que necesitamos:
// el botón de las 3 rayitas (menu-respon) y la lista de enlaces (nav-menu).
let boton = document.getElementById('menu-respon');
let menu = document.getElementById('nav-menu');

// Le decimos al botón: "quedate atento y esperá un click del usuario".
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

// --- FILTRO DE CATEGORÍAS DEL MARKETPLACE (con transición animada) ---
// Cada chip de filtro tiene un atributo data-categoria ("todos",
// "programacion", "electromecanica" o "alimentos") y cada tarjeta de
// producto tiene ese mismo dato en su propio data-categoria.
// En vez de mostrar/ocultar de golpe con display, le agregamos la clase
// "oculta" (que en CSS hace un fade + escala) y recién después de que
// termina la transición la sacamos del flujo con display:none.
const chips = document.querySelectorAll('.filtro-chip');
const tarjetas = document.querySelectorAll('.tarjeta-producto');
const mensajeVacio = document.getElementById('market-vacio');
const DURACION_TRANSICION = 350; // debe coincidir con la transición de opacity en market.css

chips.forEach((chip) => {
    chip.addEventListener('click', () => {
        const categoriaElegida = chip.dataset.categoria;

        // Marcamos visualmente cuál chip está activo (aria-pressed además
        // ayuda a lectores de pantalla a entender el estado del filtro).
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
                // Forzamos un reflow para que el navegador "registre" el
                // display:flex antes de sacar la clase oculta y así la
                // transición de opacity/scale se vea (si no, salta sin animar).
                void tarjeta.offsetWidth;
                tarjeta.classList.remove('oculta');
            } else {
                tarjeta.classList.add('oculta');
                // Esperamos a que termine el fade-out para recién ahí
                // sacarla del flujo del grid con display:none.
                setTimeout(() => {
                    if (tarjeta.classList.contains('oculta')) {
                        tarjeta.style.display = 'none';
                    }
                }, DURACION_TRANSICION);
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
                    observador.unobserve(entrada.target); // animamos una sola vez
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
