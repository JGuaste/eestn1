// Aquí estamos creando "variables". Estamos buscando en todo el documento HTML los elementos que tengan el ID menu-respon (el botón de las 3 rayitas) y nav-menu (la lista de enlaces).
let boton = document.getElementById('menu-respon');
let menu = document.getElementById('nav-menu');

//Le estamos diciendo al botón: Quedate atento y espera a que el usuario haga un click sobre vos".

//() => { ... }: Esta es una función de flecha."Cuando ocurra el click, ejecuta lo que está adentro de estas llaves".
boton.addEventListener('click', () => {
    //Esta es la línea más importante. La propiedad classList es una lista de todas las clases CSS que tiene ese elemento. El método .toggle('active') es un interruptor:

    //Si la clase active no existe, se la agrega.

    //Si la clase active ya existe, se la quita.

    // cuando .nav-menu tenga la clase .active, se vuelva visible (display: block).
    menu.classList.toggle('active');
});