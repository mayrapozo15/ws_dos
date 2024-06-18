// public/js/functions.js

$(function (){
    $('#usuario').val('');
    $('#clave').val('');

    $('#formUsuario').val('');
    $('#formNombres').val('');
    $('#formClave').val('');

});
async function iniciarSesion(){
    const usuario = $('#usuario').val();
    const contrasena = $('#clave').val();
    if(usuario!= '' && contrasena!= ''){
       await consultar(`login/${usuario}/${contrasena}`, 'GET', null, 'ws').then(async(value)=>{
            if(value.error != 0){
                alert(value.mensaje);
            }else{
                await consultar(`gudardata`, 'POST', value.datos[0], '').then((valueData)=>{
                    if(valueData.error != 0){
                        alert(valueData.mensaje);
                    }else{
                        if(value.datos[0]['rol'] == 2){
                            window.location.href = baseUrl + 'administrador';
                        }else{
                            if(value.datos[0]['rol'] == 1)
                            window.location.href = baseUrl + 'entrenador/';
                        }
                    }
                }).catch((err)=>{
                    console.log(err);
                });
                
            }
        }).catch((err)=>{
            console.log(err);
        });
    }else{
        alert('Debe completar todos los campos');
    }
}


function registrasUsuario(){
    const data = {
        escuela: $('#formEscuela').val(),
        usuario: $('#formUsuario').val(),
        clave: $('#formClave').val(),
        nombres: $('#formNombres').val(),
        rol: $('#formRol').val(),
    };
    console.log(data);
    consultar('usuario', 'POST', data, 'ws').then((value) => {
        if (value.error != '0')
            console.log(value.mensaje);
        else {
            window.location.href = baseUrl + 'login';
        }
    }).catch((error) => {
        console.log(error);
    });
}