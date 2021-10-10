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