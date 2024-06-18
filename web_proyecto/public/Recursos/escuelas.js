// creacion de una variable para verifcar si estoy creado o editando un registro de la escuela
let keySelect = -1;
//esta funcion me limpia los campos de mi pantalla para registra los datos de la escuela
function limpiarModal(){
    // en esta seccionle digo que al imput formNombre me coloque vacio ''
    $('#formNombre').val('');
    $('#formDireccion').val('');
    $('#formCategoria').attr("selected", "selected");
    keySelect = -1;
    // en esta linea de codigo muestro el modal o la pantala para ingrear los datos de la escuela
    $('#escuelaModal').modal('show');
}
// esta funcion me permite mostrar los datos de la escuela que selecione en el boton editar 
// ademas recibe como parametro la ubicacion en el arreglos escuelas "Key" o puede ser cualquier otra variable
function mostrarEscuela(key){
    // primero limpaimos la pantalla de regstro de escuelas por si a caso ya tenga datos escritos en los inputs
    limpiarModal();
    // creamos una variable donde vamos almacenar todos los datos de la escuela que selecciono
    const itemSelect = escuelas[key];
    // la posicion key le asinaremos a nuestra variable keySelect para poder editar este registro
    keySelect = key;
    // aqui abrimos el modal
    $('#escuelaModal').modal('show');
    // en las demas lineas de codigo asignamos cada valor a cada input
    $('#formNombre').val(itemSelect.nombre);
    $('#formDireccion').val(itemSelect.direccion);
    $(`#formCategoria`).val(itemSelect.categoria);
}
//  este metodo nos permite crear o actualizar una escuela 
function guardarEscuela(){
    // como primer paso creamos una variable data que nos permite enviar los datos que corresponde para crear una escuela
    const data = {
        nombre: $('#formNombre').val(),
        direccion: $('#formDireccion').val(),
        categoria: $('#formCategoria').val()
    }
    // esta seccion verificamos keySelect es diferente de -1 eso quiere decir que vamos actulizar por lo tanto 
    // deberiamos enviarle el id de esa escuela para editarla si keySelect es -1 entonces no le enviamos por que vamos a crea
    // una nueva escuela y el id es autoincremento
    if(keySelect != -1) data.id = escuelas[keySelect].id;
    // esta funcio consultar nos permite consumir nuestros servicio tien como parametros la ruta, metodo y si envio o no datos
    consultar('escuela', 'POST', data,'ws').then((value) => {
        // aqui nos va a devolver ya sea una respuesta negativa que sucedio algun error o una repsueta positiva
        // que se creo o actulizao la escuela
        if (value.error != '0')
            // verificamos si el error es difernete de cero es que hubo un error y me lo puestr por la consola del navegador 
            console.log(value.mensaje);
        else {
            // caso contrario verificamos como se comporta la pantalla si se creo un registro nuevo recargamos la pagina
          if(keySelect == -1) window.location.reload();
          else{
            // pero si solo actualizamos primero modificamos los datos de nuestro arreglo inicial con la respuesta que nos devuelve
            // el servicio value.datos[0]
            escuelas[keySelect] = value.datos[0];
            // ahora con la ayuda de .html vamos a poder editar nuestra registro en la tabla de descuelas
            // de esta amdneta podemos acceder a cada propiedad de la escuela value.datos[0]['propiedad']
            $(`#tr${value.datos[0]['id']}`).html(`
                    <td class="align-middle white-space-nowrap">${keySelect + 1}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['nombre']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['direccion']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['categoria']}</td>
                    <td class="align-middle white-space-nowrap">
                        <button class="btn btn-outline-info" type="button" onclick="mostrarEscuela(${keySelect})"> Editar </button>
                        <button class="btn btn-outline-danger" type="button" onclick="elimnarEscuela(${keySelect})"> Eliminar </button>
                    </td>
            `);
            // una ves que se cambio los datos procedemos a cerrar el modal o cuador de registro de escuelas
            $('#escuelaModal').modal('hide');
          }
        }
    }).catch((error) => {
        console.log(error);
    });
}
// este metodo no va a permitir eliminar una escuela de la base de datos que recibe como parametro 
// la ubicaion de la escuela 
function elimnarEscuela(key){
    // usando la funcion general consultar colocamos la ruta para eliminar 
    // y de esta manera ${escuelas[key].id} obtenems el id de esa escuela para eliminarla 
    consultar(`escuelaEliminar/${escuelas[key].id}`, 'GET', null, 'ws').then((value) => {
        if (value.error != '0')
          console.log(value.mensaje);
        else {
            // en esta seccion vamos a poder remover de nuestra tabla principal el registro 
            // una ves que se borro la base de datos 
          $(`#tr${escuelas[key].id}`).remove();
        }
    }).catch((error) => {
        console.log(error.mensaje);
    });
}