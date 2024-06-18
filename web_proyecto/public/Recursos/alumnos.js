let keySelect = -1;
function limpiarModal(){
    $("#btnRutinas").hide();
    $('#formEstatura').val('');
    $('#formPeso').val('');
    $('#formEdad').val('');
    $('#formCedula').val('');
    $('#formNombres').val('');
    $('#formApellidos').val('');
    $('#formEscuela').attr("selected", "selected");
    $('#formGenero').attr("selected", "selected");
    keySelect = -1;
    $('#alumnoModal').modal('show');
}

function mostrarAlumno(key){
    limpiarModal();
    $("#btnRutinas").show();
    const itemSelect = alumnos[key];
    keySelect = key;
    $(`#formEscuela`).val(itemSelect.escuela_id);
    $('#formCedula').val(itemSelect.cedula);
    $('#formNombres').val(itemSelect.nombres);
    $('#formApellidos').val(itemSelect.apellidos);
    $('#formEstatura').val(itemSelect.estatura);
    $('#formPeso').val(itemSelect.peso);
    $('#formEdad').val(itemSelect.edad);
    $(`#formGenero`).val(itemSelect.genero);
}
function cerrarAbrirModala(cerrar = '', abrir = ''){
    if(cerrar !== '')
        $(`#${cerrar}`).modal("hide");
    if(abrir != '')
        $(`#${abrir}`).modal('show');
}
function mostrarRutinas() {
    cerrarAbrirModala('alumnoModal', 'jugadoresModal');
    consultar(`rutinas_deportivas/${$('#formJugador').val()}`, 'GET', null, 'ws').then((value) => {
        if (value.error != '0') {
            alert(`${value.mensaje}`);
            $('#rutinas').html(``);
        } else {
            let rutinas = value.datos;
            let dias = {
                "Lunes": '<tr><td class="align-middle white-space-nowrap">Lunes</td>',
                "Martes": '<tr><td class="align-middle white-space-nowrap">Martes</td>',
                "Miercoles": '<tr><td class="align-middle white-space-nowrap">Miércoles</td>',
                "Jueves": '<tr><td class="align-middle white-space-nowrap">Jueves</td>',
                "Viernes": '<tr><td class="align-middle white-space-nowrap">Viernes</td>'
            };
            for (const key in rutinas) {
                let dia = rutinas[key].dia;
                if (dias[dia]) {
                    dias[dia] += `<td class="align-middle white-space-nowrap">${rutinas[key].nombre} - ${rutinas[key].repeticiones}</td>`;
                }
            }
            for (let dia in dias) {
                dias[dia] += '</tr>';
            }

            $('#rutinas').html(`
                ${dias["Lunes"]}
                ${dias["Martes"]}
                ${dias["Miercoles"]}
                ${dias["Jueves"]}
                ${dias["Viernes"]}
            `);
        }
    }).catch((error) => {
        $('#rutinas').html(``);
        console.log(error);
    });
}

function guardarAlumno(){
    const data = {
        escuela:  $('#formEscuela').val(),
        cedula:  $('#formCedula').val(),
        nombres:  $('#formNombres').val(),
        apellidos:  $('#formApellidos').val(),
        estatura:  $('#formEstatura').val(),
        peso:  $('#formPeso').val(),
        edad:  $('#formEdad').val(),
        genero:  $('#formGenero').val(),
        categoria:  $('#formCategoria').val()
    }
    if(keySelect != -1) data.id = alumnos[keySelect].id;
    consultar('alumnoNuevo', 'POST', data,'ws').then((value) => {
        if (value.error != '0')
            alert(`${value.mensaje}`);
        else {
          if(keySelect == -1) window.location.reload();
          else{
            alumnos[keySelect] = value.datos[0];
            $(`#tr${value.datos[0]['id']}`).html(`
                    <td class="align-middle white-space-nowrap">${keySelect + 1}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['escuela_nombre']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['cedula']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['apellidos']}-${value.datos[0]['nombres']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['genero']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['estatura']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['peso']}</td>
                    <td class="align-middle white-space-nowrap">${value.datos[0]['edad']}</td>
                    <td class="align-middle white-space-nowrap">
                        <button class="btn btn-outline-info" type="button" onclick="mostrarAlumno(${keySelect})"> Editar </button>
                        <button class="btn btn-outline-danger" type="button" onclick="elimnarAlumno(${keySelect})"> Eliminar </button>
                    </td>
            `);
            $('#alumnoModal').modal('hide');
          }
        }
    }).catch((error) => {
        console.log(error);
    });
}

function elimnarAlumno(key){
    consultar(`alumnoEliminar/${alumnos[key].id}`, 'GET', null, 'ws').then((value) => {
        if (value.error != '0')
            alert(`${value.mensaje}`);
        else {
          $(`#tr${alumnos[key].id}`).remove();
        }
    }).catch((error) => {
        console.log(error.mensaje);
    });
}


function mostrarRutinas() {
    $('#rutinas').html('');
    consultar(`registro_entrenamiento/${$('#formIni').val()}/${$('#fomrFin').val()}`, 'GET', null, 'ws').then((value) => {
        if (value.error != '0') {
            alert(`${value.mensaje}`);
            $('#rutinas').html(``);
        } else {    
            rutinasTemp = value.datos;
            let rutinas = value.datos, c = '';
           for (const key in rutinas) {
            if(rutinas[key].num_rutina > 0){
                c +=`
                <tr class="btn-reveal-trigger" id="trRu${rutinas[key].id}">
                    <td class="align-middle white-space-nowrap">${key + 1}</td>
                    <td class="align-middle white-space-nowrap">${rutinas[key].fecha}</td>
                    <td class="align-middle white-space-nowrap">${rutinas[key].rutina_nombre}</td>
                    <td class="align-middle white-space-nowrap">${rutinas[key].jugador_nombres} ${rutinas[key].jugador_apellidos}</td>
                    <td class="align-middle white-space-nowrap">${rutinas[key].escuela_nombre}</td>
                    <td class="align-middle white-space-nowrap">${rutinas[key].num_rutina}</td>
                </tr>
            `;
            }
            
           }
            $('#rutinas').html(c);
        }
    }).catch((error) => {
        $('#rutinas').html(``);
        console.log(error);
    });
}