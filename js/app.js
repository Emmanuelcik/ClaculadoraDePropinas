let cliente = {
    mesa: "",
    hora: "",
    pedido: []
};

const categorias = {
    1: "Comida",
    2: "Bebidas",
    3: "postres"
};

const btnSaveClient = document.querySelector("#guardar-cliente");

btnSaveClient.addEventListener("click", saveClient);

function saveClient() {
    const mesa = document.querySelector("#mesa").value;
    const hora = document.querySelector("#hora").value;


    //Revisar si hay campos vacios

    const camposVacios = [mesa, hora].some(campo => campo === "");

    if(camposVacios){
        imprimirAlerta("Ambos campos son obligatorios")
        return;
    }

    //Asignar datos del formulario al cliente
    cliente = {...cliente, mesa, hora }

    //Ocultar modal 
    const modalform = document.querySelector("#formulario");
    const modalBoot = bootstrap.Modal.getInstance(modalform);

    modalBoot.hide();

    //Mostrar las secciones
    mostrarSecciones();
    
    //Obtener platillos de la API de JSON-SERVER
    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll(".d-none");
    seccionesOcultas.forEach( seccion =>{
        seccion.classList.remove("d-none");
    })
}

function obtenerPlatillos(){
    const url = "http://localhost:4000/platillos";

    fetch(url)
        .then(res => res.json() )
        .then(res => mostrarPlatillos(res))
        .catch(err => console.log(err))
}

function mostrarPlatillos(platillos){

    const contenido = document.querySelector(".contenido");

    platillos.forEach( platillo =>{
        const row = document.createElement("div");
        row.classList.add("row", "py-3", "border-top");
        
        const nombre = document.createElement("div");
        nombre.classList.add("col-md-4");
        nombre.textContent = platillo.nombre;

        const precio = document.createElement("div");
        precio.classList.add("col-md-3", "fw-bold");
        precio.textContent = "$" + platillo.precio;

        const categoria =  document.createElement("div");
        categoria.classList.add("col-md-3");
        categoria.textContent = categorias[ platillo.categoria];


        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.value = 0;
        inputCantidad.min = 0;
        inputCantidad.id = `produco-${platillo.id}`;
        inputCantidad.classList.add("form-control");

        //Funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});
        }

        const agregar = document.createElement("div");
        agregar.classList.add("col-md-2");
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
    })
}

function agregarPlatillo(producto){
    //Extraer el arreglo actual
    let {pedido} = cliente;
    //Revisar que la cantidad sea mayor a 0
    if(producto.cantidad > 0 ){

        //Comprueba si el elemento ya existe en el array
        if( pedido.some(articulo => articulo.id === producto.id)){
            //El articulo ya existe, Actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if( articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad
                }
                return articulo;
            });
            // Se asigna el nuevo array al cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        }else {
            //El articulo no existe, entonces lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    }else {
        //Eliminar elementos cuando la cantidad sea 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado]
        console.log(resultado);
    }
    
}

function imprimirAlerta(mensaje){

    const verify = document.querySelector(".invalid-feedback");

    if(!verify){
        const form = document.querySelector(".modal-body form");
        const alerta = document.createElement("div");
        alerta.classList.add("invalid-feedback", "d-block", "text-center");
        alerta.textContent = mensaje;

        form.appendChild(alerta);

        setTimeout( ()=>{
            alerta.remove();
        },3000)
    }

    
}