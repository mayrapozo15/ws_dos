let keySelect = -1;
function limpiarModal(){
    $('#formUsuario').val('');
    $('#formClave').val('');
    $('#formNombres').val('');
    $('#formEscuela').attr("selected", "selected");
    $('#formRol').attr("selected", "selected");
    keySelect = -1;
    $('#usuarioModal').modal('show');
}

function mostrarUsuario(key){
    limpiarModal();
    const itemSelect = usuarios[key];
    keySelect = key;
    $('#usuarioModal').modal('show');
    $(`#formEscuela`).val(itemSelect.escuela);
    $('#formUsuario').val(itemSelect.usuario);
    $('#formClave').val(itemSelect.clave);
    $('#formNombres').val(itemSelect.nombres);
    $(`#formRol`).val(itemSelect.rol);
}

function guardarUsuario(){
    const data = {
        escuela:  $('#formEscuela').val(),
        usuario: $('#formUsuario').val(),
        clave: $('#formClave').val(),
        nombres: $('#formNombres').val(),
        rol: $('#formRol').val()
    }
    if(keySelect != -1) data.id = usuarios[keySelect].id;
    consultar('usuario', 'POST', data,'ws').then((value) => {
        if (value.error != '0')
            console.log(value.mensaje);
        else {
          if(keySelect == -1) window.location.reload();
          else{
            usuarios[keySelect] = value.datos[0];
            $(`#tr${value.datos[0]['id']}`).html(`
                    <td class="align-middle white-space-nowrap">${keySelect + 1}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['nombres']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['escuela_nombre']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['rol_nombre']}</td>
                    <td class="align-middle white-space-nowrap">@${value.datos[0]['usuario']}</td>
                    <td class="align-middle white-space-nowrap">
                        <button class="btn btn-outline-info" type="button" onclick="mostrarUsuario(${keySelect})"> Editar </button>
                        <button class="btn btn-outline-danger" type="button" onclick="elimnarUsuario(${keySelect})"> Eliminar </button>
                    </td>
            `);
            $('#usuarioModal').modal('hide');
          }
        }
    }).catch((error) => {
        console.log(error);
    });
}
function elimnarUsuario(key){
    consultar(`usuarioEliminar/${usuarios[key].id}`, 'GET', null, 'ws').then((value) => {
        if (value.error != '0')
          console.log(value.mensaje);
        else {
          $(`#tr${usuarios[key].id}`).remove();
        }
    }).catch((error) => {
        console.log(error.mensaje);
    });
}