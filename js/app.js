

const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas{
    constructor() {
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter(c => c.id !== id);
    }

    editarCita(citaActualizada){
        this.citas =  this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);

    }

}

class UI{

    ImprimirAlerta(mensaje, tipo){

        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12');

        //Agregar clase tipo error 
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

       setTimeout(() => {
           divMensaje.remove();
           
       }, 2000);

    }

    imprimirCitas({citas}){

        this.limpiarHTML();

        citas.forEach(ci => {

            const{mascota, propietario, telefono, fecha, hora, sintomas, id} = ci;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            //Scripting de los elementos de la cita 
            const mascotaP = document.createElement('h2');
            mascotaP.classList.add('card-title', 'font-weight-bolder');
            mascotaP.textContent = mascota;

            const propietarioP = document.createElement('p');
            propietarioP.innerHTML = `
            <span  class="font-weight-bolder">Propietario: </span>${propietario}
            `;

            const telefonoP = document.createElement('p');
            telefonoP.innerHTML = `
            <span  class="font-weight-bolder">Telefono: </span>${telefono}
            `;

            const fechaP = document.createElement('p');
            fechaP.innerHTML = `
            <span  class="font-weight-bolder">Fecha: </span>${fecha}
            `;

            const horaP = document.createElement('p');
            horaP.innerHTML = `
            <span  class="font-weight-bolder">Hora: </span>${hora}
            `;

            const sintomasP = document.createElement('p');
            sintomasP.innerHTML = `
            <span  class="font-weight-bolder">Sintomas:</span> ${sintomas}
            `;

            //Boton para Eliminar Cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>`;

            btnEliminar.onclick = () => eliminarCita(id);

            //Boton para Editar Cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>`;

            btnEditar.onclick = () => cargarEdicion(ci);


            //Agregar los parrafos al divCita 
            divCita.appendChild(mascotaP);
            divCita.appendChild(propietarioP);
            divCita.appendChild(telefonoP);
            divCita.appendChild(fechaP);
            divCita.appendChild(horaP);
            divCita.appendChild(sintomasP);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);


            //Agregar la cita al HTML
            contenedorCitas.appendChild(divCita);

        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

}

const ui = new UI();
const admCitas = new Citas();

eventListeners();

function eventListeners(){
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);

    formulario.addEventListener('submit', nuevaCita);

}

//Objeto con la Informacion de la Cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''

}

function datosCita(e){
    citaObj[e.target.name] = e.target.value;

    
}

//Valida y agrega una nueva Cita a la clase de Citas
function nuevaCita(e){
    e.preventDefault();

    //Extraer la Informacion del Objeto de citas
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //Validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        
        ui.ImprimirAlerta('Todos los campos son obligatorios','error');
        
        return;
    }
    if(editando){
        ui.ImprimirAlerta('Editado Correctamente!','exito')

        //Pasar el objeto de la cita a edicion 
        admCitas.editarCita({...citaObj});


        //Texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        editando = false;

    }else{

     //generar Id unico
     citaObj.id = Date.now();

     //Crear una nueva Cita
     admCitas.agregarCita({...citaObj}); //se pasa copia del Objeto global para que no duplique el ultimo valor

     //Mensaje de agregado correctamente!
     ui.ImprimirAlerta('Se agrego Correctamente!','exito')
    }

    
    //reiniciar Objeto
    reiniciarObjeto();

    //reiniciar formulario
    formulario.reset();

    //Mostrar el HTML de las Citas
    ui.imprimirCitas(admCitas);

}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}

function eliminarCita(id){

    //Eliminar cita
    admCitas.eliminarCita(id);

    //Muestre un Mensaje
    ui.ImprimirAlerta('La cita se elimino correctamente','exito');

    //Refrescar las citas
    ui.imprimirCitas(admCitas);

}

function cargarEdicion(cita){

    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    //Llenar los Input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto 
    citaObj.mascota = mascota;
    citaObj.propietario = propietario
    citaObj.telefono = telefono
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton 
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}