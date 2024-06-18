async function consultar(url, tipo = 'GET', datos = null, rutaEnlace = '') {
    return await new Promise((resolve, reject) => {
        if (rutaEnlace == 'ws') rutaEnlace = 'http://localhost/ws_core/public/index.php/';
        if (rutaEnlace == '') rutaEnlace = 'http://localhost/web_proyecto/public/index.php/';
        try {
            $.ajax({
                type: tipo,
                url: `${rutaEnlace}${url}`,
                data: JSON.stringify(datos), // Convertir el objeto a una cadena JSON
                contentType: "application/json", // Establecer el tipo de contenido como JSON
                dataType: 'json',
                success: function (response) {
                    var json = imprimirError('9999', 'Error en la consulta JS');
                    if(typeof response === 'string')
                        json = JSON.parse(response);
                    else
                        json = response;
                    resolve(json);
                },
                error: function( jqXHR, textStatus, errorThrown ) {
                    reject(imprimirError('9999', 'Error en la consulta JS, vuelva a intentar'));
                }
            });
        } catch ({ name, message }) {
            reject(imprimirError('9999', `${name}: ${message}`));
        }
    });
}
function notificacion(mensaje = '', color = 'success', titulo = 'Correcto!',){
    $('#liveToast').html(`
        <div class="toast-header bg-${color} text-white"><strong class="me-auto">${titulo}</strong><small>${mensaje}</small>
            <button class="btn-close btn-close-white" type="button" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${mensaje}</div>
    `);
    $('#liveToastBtn').click();
}
function imprimirError(error, mensaje, datos = null) {
    if (datos == null) {
        return {
            'error': error,
            'mensaje': mensaje
        };
    } else {
        return {
            'error': error,
            'mensaje': mensaje,
            'datos': datos
        };
    }
}