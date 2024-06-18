let keySelect = -1;
function limpiarModal(){
    $('#formNombres').val('');
    $('#formApellidos').val('');
    $('#formGenero').attr("selected", "selected");
    $('#formEstatura').val('');
    $('#formPeso').val('');
    $('#formEdad').val('');
    $('#formCategoria').attr("selected", "selected");
    keySelect = -1;
    cerrarAbrirModala('', 'jugadorModal');
}

function mostrarJugador(key){
    limpiarModal();
    const itemSelect = jugadores_destacados[key];
    keySelect = key;
    $('#formNombres').val(itemSelect.nombres);
    $('#formApellidos').val(itemSelect.apellidos);
    $('#formEstatura').val(itemSelect.estatura);
    $('#formPeso').val(itemSelect.peso);
    $('#formEdad').val(itemSelect.edad);
    $(`#formGenero`).val(itemSelect.genero);
    $(`#formCategoria`).val(itemSelect.categoria);
}
function cerrarAbrirModala(cerrar = '', abrir = ''){
    if(cerrar != '')
        $(`#${cerrar}`).modal("hide");
    if(abrir != '')
    $(`#${abrir}`).modal('show');
}

function guardarJugador(){
    const data = {
        nombres:  $('#formNombres').val(),
        apellidos:  $('#formApellidos').val(),
        estatura:  $('#formEstatura').val(),
        peso:  $('#formPeso').val(),
        edad:  $('#formEdad').val(),
        genero:  $('#formGenero').val(),
        categoria:  $('#formCategoria').val()
    }
    if(keySelect != -1) data.id = jugadores_destacados[keySelect].id;
    consultar('jugadores_destacados', 'POST', data,'ws').then((value) => {
        if (value.error != '0')
            alert(`${value.mensaje}`);
        else {
          if(keySelect == -1) window.location.reload();
          else{
            jugadores_destacados[keySelect] = value.datos[0];
            $(`#tr${value.datos[0]['id']}`).html(`
                    <td class="align-middle white-space-nowrap">${keySelect + 1}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['nombres']} ${value.datos[0]['apellidos']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['genero']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['estatura']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['peso']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['edad']}</td>
                    <td class="align-middle white-space-nowrap">
                       <button class="btn btn-outline-info" type="button" onclick="mostrarJugador(${keySelect})">
								<i class="fas fa-times"></i>
								Editar
							</button>
							<button class="btn btn-outline-info" type="button" onclick="mostrarRutinas(${keySelect})">
								<i class="fas fa-times"></i>
								Ver Rutinas
							</button>
							<button class="btn btn-outline-danger" type="button" onclick="elimnarJugador(${keySelect})">
								<i class="fas fa-times"></i>
								Eliminar
							</button>
                    </td>
            `);
            cerrarAbrirModala('jugadorModal');
          }
        }
    }).catch((error) => {
        console.log(error);
    });
}
function elimnarJugador(key){
    consultar(`jugadores_destacados/${jugadores_destacados[key].id}`, 'DELETE', null, 'ws').then((value) => {
        if (value.error != '0')
            alert(`${value.mensaje}`);
        else {
          $(`#tr${jugadores_destacados[key].id}`).remove();
        }
    }).catch((error) => {
        console.log(error.mensaje);
    });
}
let keyRutina = -1;
function limpiarRutina (){
    $('#formDia').val('Lunes');
    $('#formNombreRutina').val('');
    $('#formRepeticiones').val('');
    keyRutina = -1;
}
function mostrarRutina (key){
    let rutinaSelec = rutinasTemp[key];
    keyRutina = key;
    $('#formDia').val(rutinaSelec.dia);
    $('#formNombreRutina').val(rutinaSelec.nombre);
    $('#formRepeticiones').val(rutinaSelec.repeticiones);
}

let rutinasTemp = [];
function mostrarRutinas(key) {
    rutinasTemp = [];
    limpiarRutina ();
    keySelect = key;
    $('#rutinas').html('');
    $('#formNombreJugador').text(`${jugadores_destacados[key].nombres} ${jugadores_destacados[key].apellidos}`);
    cerrarAbrirModala('', 'rutinasModal');
    consultar(`rutinas_deportivas/${jugadores_destacados[key].id}`, 'GET', null, 'ws').then((value) => {
        if (value.error != '0') {
            alert(`${value.mensaje}`);
            $('#rutinas').html(``);
        } else {
            rutinasTemp = value.datos;
            let rutinas = value.datos, c = '';
           for (const key in rutinas) {
            c +=`
                <tr class="btn-reveal-trigger" id="trRu${rutinas[key].id}">
                    <td class="align-middle white-space-nowrap">${rutinas[key].dia}</td>
                    <td class="align-middle white-space-nowrap">${rutinas[key].nombre}</td>
                    <td class="align-middle white-space-nowrap">${rutinas[key].repeticiones}</td>
                    <td class="align-middle white-space-nowrap">
                         <button class="btn btn-outline-info" type="button" onclick="mostrarRutina(${key})">
                            <i class="fas fa-times"></i>
                            Editar
                        </button>
                        <button class="btn btn-outline-danger" type="button" onclick="elimnarRutina(${key})">
                            <i class="fas fa-times"></i>
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
           }
            $('#rutinas').html(c);
        }
    }).catch((error) => {
        $('#rutinas').html(``);
        console.log(error);
    });
}
function guardarRutina() {
    const data = {
        jugador: jugadores_destacados[keySelect].id,
        dia: $('#formDia').val(),
        nombre: $('#formNombreRutina').val(),
        repeticiones: $('#formRepeticiones').val()
    };
    if(keyRutina != -1) data.id = rutinasTemp[keyRutina].id;
    consultar(`rutinas_deportivas`, 'POST', data, 'ws').then((value) => {
        if (value.error != '0') {
            alert(`${value.mensaje}`);
        } else {
            if(keyRutina == -1){
                rutinasTemp.push(value.datos);
                $('#rutinasJugdores').append(`  
                    <tr class="btn-reveal-trigger" id="trRu${value.datos['id']}">
                        <td class="align-middle white-space-nowrap">${value.datos['dia']}</td>
                        <td class="align-middle white-space-nowrap">${value.datos['nombre']}</td>
                        <td class="align-middle white-space-nowrap">${value.datos['repeticiones']}</td>
                        <td class="align-middle white-space-nowrap">
                            <button class="btn btn-outline-info" type="button" onclick="mostrarRutina(${rutinasTemp.length - 1})">
                                <i class="fas fa-times"></i>
                                Editar
                            </button>
                            <button class="btn btn-outline-danger" type="button" onclick="elimnarRutina(${rutinasTemp.length - 1})">
                                <i class="fas fa-times"></i>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                   `);
            }else{
                rutinasTemp[keyRutina] = value.datos;
                $(`#trRu${value.datos['id']}`).html(`
                    <td class="align-middle white-space-nowrap">${value.datos['dia']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos['nombre']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos['repeticiones']}</td>
                    <td class="align-middle white-space-nowrap">
                        <button class="btn btn-outline-info" type="button" onclick="mostrarRutina(${keyRutina})">
                            <i class="fas fa-times"></i>
                            Editar
                        </button>
                        <button class="btn btn-outline-danger" type="button" onclick="elimnarRutina(${keyRutina})">
                            <i class="fas fa-times"></i>
                            Eliminar
                        </button>
                    </td>
                `);
            }
           
        }
    }).catch((error) => {
        $('#rutinas').html(``);
        console.log(error);
    });
}
function elimnarRutina(key){
    consultar(`rutinas_deportivas/${rutinasTemp[key].id}`, 'DELETE', null, 'ws').then((value) => {
        if (value.error != '0')
            alert(`${value.mensaje}`);
        else {
          $(`#trRu${rutinasTemp[key].id}`).remove();
        }
    }).catch((error) => {
        console.log(error.mensaje);
    });
}