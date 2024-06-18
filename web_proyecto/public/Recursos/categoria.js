let keySelect = -1;
function limpiarModal(){
    $('#formNombre').val('');
    keySelect = -1;
    $('#categoriaModal').modal('show');
}

function mostrarCategoria(key){
    limpiarModal();
    const itemSelect = categorias[key];
    keySelect = key;
    $('#categoriaModal').modal('show');
    $('#formNombre').val(itemSelect.nombre);
}

function guardarCategoria(){
    const data = {
        nombre: $('#formNombre').val(),
    }
    if(keySelect != -1) data.id = categorias[keySelect].id;
    consultar('categoria_escuela', 'POST', data,'ws').then((value) => {
        if (value.error != '0'){
            console.log(value.mensaje);
            notificacion(value.mensaje, 'danger', 'Error');
        }else {
          if(keySelect == -1) window.location.reload();
          else{
            categorias[keySelect] = value.datos[0];
            $(`#tr${value.datos[0]['id']}`).html(`
                    <td class="align-middle white-space-nowrap">${keySelect + 1}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['nombre']}</td>
                    <td class="align-middle white-space-nowrap">
                        <button class="btn btn-outline-info" type="button" onclick="mostrarCategoria(${keySelect})"> Editar </button>
                        <button class="btn btn-outline-danger" type="button" onclick="eliminarCategoria(${keySelect})"> Eliminar </button>
                    </td>
            `);
            $('#categoriaModal').modal('hide');
            notificacion('Guardado Correctamente');
          }
        }
    }).catch((error) => {
        console.log(error);
    });
}

function eliminarCategoria(key){
    consultar(`categoria_escuela_eliminar/${categorias[key].id}`, 'GET', null, 'ws').then((value) => {
        if (value.error != '0')
          console.log(value.mensaje);
        else {
          $(`#tr${categorias[key].id}`).remove();
        }
    }).catch((error) => {
        console.log(error.mensaje);
    });
}