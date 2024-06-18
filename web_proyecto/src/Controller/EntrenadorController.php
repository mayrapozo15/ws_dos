<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;

class EntrenadorController extends AbstractController
{
    private $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    #[Route('/gudardata', name: 'accesoSistema', methods: ['POST'])]
    public function accesoSistema(): JsonResponse
    {
        $request = $this->requestStack->getCurrentRequest();
        $data = json_decode($request->getContent(), true);
        if (!isset($data)) return $this->json(['error' => 9998, 'mensaje' => 'data not defined']);
        $session = $this->requestStack->getSession();
        $session->set('data', $data);
        return $this->json(['error' => 0, 'mensaje' => 'Aprobado']);
    }
   // ejemplo edad 12 anio
   #[Route('/entrenador/vistasEdad', name: 'app_vistaEdadControlador')]
    public function vistaEdadControlador(Request $request): Response
    {
        $alumnos = $this->consultar('alumno_edad/12');
        return $this->render('entrenador/vistaAlumnosEdad.html.twig',[
            'alumnos' => $alumnos['error'] <> '0' ? [] : (array) $alumnos['datos'],
        ]);
    }
    //
    #[Route('/entrenador/', name: 'app_entrenador')]
    public function index(Request $request): Response
    {
        $session = $this->requestStack->getSession();
        $data = $session->get('data', []);
        return $this->render('entrenador/index.html.twig',[
            "datos_entrenador" => $data,
        ]);
    }
    #[Route('/entrenador/alumnos', name: 'app_alumnos')]
    public function alumnos(): Response
    {
        $session = $this->requestStack->getSession();
        $data = $session->get('data', []);
        $jugadores_destacados = $this->consultar('jugadores_destacados');
        $alumnos = $this->consultar('alumno_escuela/'.$data['escuela']);
        $escuelas = $this->consultar('escuela/'.$data['escuela']);
        return $this->render('entrenador/alumnos.html.twig', [
            'alumnos' => $alumnos['error'] <> '0' ? [] : (array) $alumnos['datos'],
            'escuelas' => $escuelas['error'] <> '0' ? [] : (array) $escuelas['datos'],
            'jugadores_destacados' => $jugadores_destacados['error'] <> '0' ? [] : (array) $jugadores_destacados['datos'],
        ]);
    }
    #[Route('/entrenador/jugadores', name: 'app_jugadores')]
    public function jugadores(): Response
    {
        $jugadores_destacados = $this->consultar('jugadores_destacados');
        return $this->render('entrenador/jugadores.html.twig', [
            'jugadores_destacados' => $jugadores_destacados['error'] <> '0' ? [] : (array) $jugadores_destacados['datos'],
        ]);
    }
 //REPORTES
    #[Route('/entrenador/jugadores_reporte', name: 'app_jugadores_reporte')]
    public function jugadores_reporte(): Response
    {
        
        return $this->render('entrenador/alumnos_reporte.html.twig', []);

    }

    function consultar($url, $datos = null, $rutaEnlace = '', $tipo = 'GET')
    {
        try {
            if ($rutaEnlace == '')
                $rutaEnlace = 'http://localhost/ws_core/public/index.php/';
            $curl = curl_init();
            $head = array(
                CURLOPT_URL => $rutaEnlace . $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => $tipo,
                CURLOPT_HTTPHEADER => array(
                    'Accept: application/json',
                    'Content-Type: application/json',
                ),
            );
            if ($tipo != 'GET')
                $head[CURLOPT_POSTFIELDS] = json_encode($datos);
            curl_setopt_array(
                $curl,
                $head
            );
            $response = curl_exec($curl);
            curl_close($curl);
            $o_res = json_decode($response);
        } catch (\Throwable $th) {
            $o_res = $this->imprimirError('9999', $th->getMessage());
        }
        return (array) $o_res;
    }
    function imprimirError($error, $mensaje, $datos = null)
    {
        if ($datos != null)
            return [
                "error" => $error,
                "mensaje" => $mensaje,
                "datos" => $datos
            ];
        else
            return [
                "error" => $error,
                "mensaje" => $mensaje
            ];
    }
}