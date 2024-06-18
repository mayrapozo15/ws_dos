<?php
sesion_start();
include ('Conexion.php')

if (isset($_POST[Usuario]) && isset($_POST[Clave])){

    function validate($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;

    }
    /**ahora vamos a crear usuario y clave* */

    $Usuario =validate($_POST['Usuario']);
    $Usuario =validate($_POST['Clave']);

    /**aqui vamos a ingresar las condiciones*/
    if (empty(Usuario)){
        header("Location: Index.php?error-El usuario es Requerido");
        exit();
    }elseif (empty(Clave)){
        header("Location: Index.php?error-La clave es Requerida");
        exit();


    }

    }

}