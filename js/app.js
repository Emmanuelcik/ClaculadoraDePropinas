let cliente = {
    mesa: "",
    hora: "",
    pedido: []
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
        row.classList.add("row");
        
        const nombre = document.createElement("div");
        nombre.classList.add("col-md-4");
        nombre.textContent = platillo.nombre;

        row.append(nombre);
        contenido.appendChild(row);
    })
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