// Encabezado y pie compartidos para todas las páginas principales.
const paginaActual = window.location.pathname.split("/").pop() || "index.html";
const enlacePagina = (nombre, archivo) => {
    const actual = paginaActual.toLowerCase() === archivo.toLowerCase();
    return `<a href="${archivo}"${actual ? ' aria-current="page"' : ""}>${nombre}</a>`;
};

const header = document.getElementById("site-header");
if (header) {
    header.innerHTML = `
        <header>
            <div class="logo-contenedor">
                <img src="imagenes/Logo.png" alt="Logo de la escuela" class="logo-img">
                <a href="index.html" class="logo-texto">E.E.S.T N°1</a>
            </div>
            <button class="menu-respon" id="menu-respon" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="nav-menu">☰</button>
            <nav class="nav-menu" id="nav-menu" aria-label="Navegación principal">
                <ul>
                    <li>${enlacePagina("Inicio", "index.html")}</li>
                    <li class="linea" aria-hidden="true"></li>
                    <li class="submenu">
                        <a href="#">Modalidades</a>
                        <ul class="submenu-contenido">
                            <li>${enlacePagina("Programación", "programacion.html")}</li>
                            <li>${enlacePagina("Electromecánica", "electromecanica.html")}</li>
                            <li>${enlacePagina("Alimentos", "alimentos.html")}</li>
                        </ul>
                    </li>
                    <li class="linea" aria-hidden="true"></li>
                    <li class="submenu">
                        <a href="#">Nosotros</a>
                        <ul class="submenu-contenido">
                            <li>${enlacePagina("Historia", "historia.html")}</li>
                            <li>${enlacePagina("Noticias", "noticias.html")}</li>
                            <li>${enlacePagina("Cooperadora", "indexCoop.html")}</li>
                            <li>${enlacePagina("Centro estudiantes", "indexcentro.html")}</li>
                        </ul>
                    </li>
                    <li class="linea" aria-hidden="true"></li>
                    <li>${enlacePagina("Marketplace", "marketplace.html")}</li>
                    <li class="linea" aria-hidden="true"></li>
                    <li>${enlacePagina("Preinscripción escolar", "inscripcion.html")}</li>
                </ul>
            </nav>
        </header>`;
}

const footer = document.getElementById("site-footer");
if (footer) {
    footer.innerHTML = `
        <footer>
            <div class="footer-columnas">
                <div class="footer-col reveal" style="--retraso: 0s;">
                    <h4>E.E.S.T.</h4>
                    <p>Escuela de Educación Secundaria Técnica N°1 "Ejército Argentino"</p>
                    <p class="footer-direccion">
                        <img src="imagenes/Ubicacion.png" alt="" class="ubicacion">
                        <a href="https://www.google.com/maps/place/Escuela+De+Educaci%C3%B3n+Secundaria+T%C3%A9cnica+N%C2%BA1+%22Ej%C3%A9rcito+Argentino%22/@-34.9995008,-61.0369536,14z/data=!4m6!3m5!1s0x95bf4b57ed7cf6b1:0x5ee52c52f44d2436!8m2!3d-34.995334!4d-61.045388!16s%2Fg%2F11b7q8ndb6" target="_blank" rel="noopener noreferrer">San Martín 1655, B6015, Los Toldos</a>
                    </p>
                </div>
                <div class="footer-col reveal" style="--retraso: 0.12s;">
                    <h4>Contactanos</h4>
                    <p><a href="mailto:eest1gralviamonte@abc.gob.ar">eest1gralviamonte@abc.gob.ar</a></p>
                    <p>02358 44-4142</p>
                </div>
                <div class="footer-col reveal" style="--retraso: 0.24s;">
                    <h4>Seguinos</h4>
                    <div class="footer-redes">
                        <div class="social"><a href="https://www.facebook.com/escuela.tecnica.52/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook de la escuela"><img src="imagenes/facebook.gif" alt=""></a></div>
                        <div class="social"><a href="https://www.instagram.com/escuelatecnica1_viamonte/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de la escuela"><img src="imagenes/instagram.gif" alt=""></a></div>
                    </div>
                </div>
            </div>
            <div class="footer-inferior">
                <p style="text-transform: capitalize;">Provincia de Buenos Aires</p>
                <strong>© 2026. Todos los derechos reservados.</strong>
            </div>
        </footer>`;
}
