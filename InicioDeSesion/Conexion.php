<?php

$host = "localhost"; /* colocamos esto porque estamos trabaj con servidor local*/
/* colocamos user root, el passwor va a estar vacio*/
$User = "root";    

$pass = "";


$bd = "inisiosesiondb";

$conexion = mysqli_connect($host, $User, $pass, $bd)
 



if (!$con) {
    echo "Conexión fallida";
}
