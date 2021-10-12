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
        inputCantidad.id = `producto-${platillo.id}`;
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
        // console.log(resultado);
    }
    //Limpiar HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        //Mostrar el resumen de consumo
        actualizarResumen();
    }else{
        pedidoVacio();
    }
    
}

function actualizarResumen(){
    const contenido = document.querySelector("#resumen .contenido");

    const resumen = document.createElement("div");
    resumen.classList.add("col-md-6", "card", "py-3", "px-3", "shadow");

    //Agregar mesa
    const mesa = document.createElement("p");
    mesa.textContent = "Mesa: ";
    mesa.classList.add("fw-bold");

    const mesaSpan = document.createElement("span");
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add("fw-normal");

    //Agregar hora

    const hora = document.createElement("p");
    hora.textContent = "hora: ";
    hora.classList.add("fw-bold");

    const horaSpan = document.createElement("span");
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add("fw-normal");

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion
    const heading = document.createElement("h3");
    heading.textContent = "Platillos consumidos";
    heading.classList.add("my-4", "text-center");

    //Iterar sobre el array de peddos
    const group = document.createElement("ul");
    group.classList.add("list-group");

    const {pedido} = cliente;
    pedido.forEach( articulo => {
        const {nombre, cantidad, id, precio} = articulo;

        const lista = document.createElement("li");
        lista.classList.add("list-group-item"); 
        
        const nombreEl = document.createElement("h4");
        nombreEl.classList.add("my-4");
        nombreEl.textContent = nombre;


        //Agregar la cantidad
        const cantidadEl = document.createElement("p");
        cantidadEl.classList.add("fw-bold");
        cantidadEl.textContent = "Cantidad: ";

        const cantidadValor = document.createElement("span");
        cantidadValor.classList.add("fw-normal");
        cantidadValor.textContent = cantidad;

        //Agregar el precio
        const precioEl = document.createElement("p");
        precioEl.classList.add("fw-bold");
        precioEl.textContent = "Precio: ";
 
        const precioValor = document.createElement("span");
        precioValor.classList.add("fw-normal");
        precioValor.textContent = `$${precio}`;

        //Agregar el subtotal
        const subtotalEl = document.createElement("p");
        subtotalEl.classList.add("fw-bold");
        subtotalEl.textContent = "subtotal: ";
  
        const subtotalValor = document.createElement("span");
        subtotalValor.classList.add("fw-normal");
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        //Boton para eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("btn", "btn-danger");
        botonEliminar.textContent = "Eliminar del Pedido";
        
        //Funcion para eliminar del pedido
        botonEliminar.onclick = function() {
            eliminarProducto(id);
        }
        //Agregar span a su li
        cantidadEl.append(cantidadValor);
        precioEl.append(precioValor);
        subtotalEl.append(subtotalValor);

        //Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl)
        lista.appendChild(botonEliminar)

        //Agregar lista al grupo principal 
        group.appendChild(lista)
    })
    
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(group);

    contenido.appendChild(resumen);

    //Mostrar el formulario de propinas
    formularioPropina();
}

function calcularSubtotal(precio, cantidad){
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    
    const {pedido} = cliente;
    //Eliminar elementos cuando la cantidad sea 0
    const resultado = pedido.filter( articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    //Limpiar HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        //Mostrar el resumen de consumo
        actualizarResumen();
    }else{
        pedidoVacio();
    }
    //El producto se elimino por lo tanto regresamos la cantidad a 0 en el form
    const productoEliminado = `#producto-${id}`;
    console.log(productoEliminado);
    const inputEliminado = document.querySelectorAll(productoEliminado);
    inputEliminado.value = 0;
}

function pedidoVacio(){
    const contenido = document.querySelector("#resumen .contenido");
    
    const pedidoVacio = document.createElement("p");
    pedidoVacio.textContent = "Añade los elementos del pedido";
    pedidoVacio.classList.add("text-center");

    contenido.appendChild(pedidoVacio);
}

function formularioPropina () {
    const contenido = document.querySelector("#resumen .contenido");

    const form = document.createElement("div");
    form.classList.add("col-md-6", "formulario");

    const divForm = document.createElement("div");
    divForm.classList.add("card", "py-3", "px-3", "shadow")

    const heading = document.createElement("h3");
    heading.classList.add("my-4", "text-center");
    heading.textContent = "Propina:"

    //Agregar raido button 10%
    const radio10 = document.createElement("input");
    radio10.type = "radio";
    radio10.name = "propina"
    radio10.value = "10"
    radio10.classList.add("form-check-input");
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement("label");
    radio10Label.textContent = "10%";
    radio10Label.classList.add("form-check-label");

    const radio10Div = document.createElement("div");
    radio10Div.classList.add("form-check");

  

    //Agregar raido button 25%
    const radio20 = document.createElement("input");
    radio20.type = "radio";
    radio20.name = "propina"
    radio20.value = "25"
    radio20.classList.add("form-check-input");
    radio20.onclick = calcularPropina;

    const radio20Label = document.createElement("label");
    radio20Label.textContent = "25%";
    radio20Label.classList.add("form-check-label");

    const radio20Div = document.createElement("div");
    radio20Div.classList.add("form-check");

    //Agregar raido button 50%
    const radio50 = document.createElement("input");
    radio50.type = "radio";
    radio50.name = "propina"
    radio50.value = "50"
    radio50.classList.add("form-check-input");
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement("label");
    radio50Label.textContent = "50%";
    radio50Label.classList.add("form-check-label");

    const radio50Div = document.createElement("div");
    radio50Div.classList.add("form-check");

    radio10Div.appendChild(radio10);
    radio20Div.appendChild(radio20);
    radio50Div.appendChild(radio50);

    radio10Div.appendChild(radio10Label);
    radio20Div.appendChild(radio20Label);
    radio50Div.appendChild(radio50Label);
    

    //Agregar al div principal
    divForm.append(heading);
    divForm.appendChild(radio10Div);
    divForm.appendChild(radio20Div);
    divForm.appendChild(radio50Div);

    form.appendChild(divForm);

    contenido.appendChild(form);
}

function calcularPropina(){
    let subtotal = 0;
    const {pedido} = cliente;

    //Calcular a pagar
    pedido.forEach(articulo =>{
        subtotal  += articulo.cantidad * articulo.precio;
    });
    
    //Seleccionar el radio button con la propina del cliente
    const propinaSelcccionada = document.querySelector("[name='propina']:checked").value;
    

    //calcular la propina
    const propina = ((subtotal * parseInt(propinaSelcccionada) ) / 100);
    
    //Calcular total a pagar
    const total = subtotal + propina;

    mostrarTotal(subtotal, total, propina);
}

function mostrarTotal(subtotal, total, propina){
    const divTotal = document.createElement("div");
    divTotal.classList.add("total-pagar", "my-4")

    const formulario = document.querySelector(".formulario > div")
    
    //Subtotal
    const subtotalParrafo = document.createElement("p");
    subtotalParrafo.classList.add("fs-4", "fw-bold", "mt-2");
    subtotalParrafo.textContent = "Subtotal Consumo: ";

    const subtotalSpan = document.createElement("span");
    subtotalSpan.classList.add("fw-normal");
    subtotalSpan.textContent = `$${subtotal}`;

    //Propina
    const propinaParrafo = document.createElement("p");
    propinaParrafo.classList.add("fs-4", "fw-bold", "mt-2");
    propinaParrafo.textContent = "Propina: ";

    const propinaSpan = document.createElement("span");
    propinaSpan.classList.add("fw-normal");
    propinaSpan.textContent = `$${propina}`;

    //Total
    const totalParrafo = document.createElement("p");
    totalParrafo.classList.add("fs-4", "fw-bold", "mt-2");
    totalParrafo.textContent = "Total: ";

    const totalSpan = document.createElement("span");
    totalSpan.classList.add("fw-normal");
    totalSpan.textContent = `$${total}`;

    subtotalParrafo.append(subtotalSpan);
    propinaParrafo.append(propinaSpan);
    totalParrafo.append(totalSpan);

    //Eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector(".total-pagar");
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }
    
    divTotal.appendChild(subtotalParrafo);
    divTotal.appendChild(propinaParrafo);
    divTotal.appendChild(totalParrafo);
    
    formulario.appendChild(divTotal)

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

function limpiarHTML(){
    const contenido = document.querySelector("#resumen .contenido");
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}