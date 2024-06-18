<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Sesion</title>
    <link rel ="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>

<!vamos a hacer un formulario>

    <form action="IniciarSesion.php" method="POST"> <!este form action va a accionar en un archivo llamado IniciarSesion.php, Y VA A TENER UN METODO DE TIPO POST>
    <!vamos a hacer un icono que respresente al usuario>
    <h1>INICIAR SESION</h1>
        <i class="fa-solid fa-user"></i>
        <label>Usuario</label>
        <input type="text" name="Usuario" placeholder="Nombre de Usuario">

        <!vamos a hacer un icono que respresente la contraseña>
        <i class="fa-solid fa-unlock"></i>
        <label>Clave</label>
        <input type="text" name="Clave" placeholder="Clave">
        <!boton de iniciar sesion>
        <buton type="submit">Iniciar Sesion" </button>
        <!boton de crear cuenta>
        <a href="CrearCuenta.php">Crear cuenta</a>

    
</body>
</html>