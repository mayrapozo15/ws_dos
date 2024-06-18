<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpClient\Exception\ClientException;
class AdministradorController extends AbstractController
{
    #[Route('/administrador/', name: 'app_index')]
    public function index(): Response
    {
        return $this->render('administrador/index.html.twig', [
            'controller_name' => 'AdministradorController',
        ]);
    }
    #[Route('/administrador/escuelas', name: 'app_escuelas')]
    public function escuelas(): Response
    {
        $escuelas = $this->consultar('escuela');
        $categoria_escuela = $this->consultar('categoria_escuela');
        return $this->render('administrador/escuelas.html.twig', [
            'escuelas' => $escuelas['error'] <> '0' ? [] : (array) $escuelas['datos'],
            'categoria_escuela' => $categoria_escuela['error'] <> '0' ? [] : (array) $categoria_escuela['datos'],
        ]);
    }
  
    #[Route('/administrador/categorias', name: 'app_categorias_escuela')]
    public function categoriasEscuela(): Response
    {
        $categoria_escuela = $this->consultar('categoria_escuela');
        return $this->render('administrador/categoriasEscuela.html.twig', [
            'controller_name' => 'AdministradorController',
            'categoria_escuela' => $categoria_escuela['error'] <> '0' ? [] : (array) $categoria_escuela['datos'],
        ]);
    }
    #[Route('/administrador/usuarios', name: 'app_usuarios')]
    public function usuarios(): Response
    {
        $usuarios = $this->consultar('usuario');
        $roles = $this->consultar('rol');
        $escuelas = $this->consultar('escuela');
        return $this->render('administrador/usuarios.html.twig', [
            'usuarios' => $usuarios['error'] <> '0' ? [] : (array) $usuarios['datos'],
            'roles' => $roles['error'] <> '0' ? [] : (array) $roles['datos'],
            'escuelas' => $escuelas['error'] <> '0' ? [] : (array) $escuelas['datos'],
        ]);
    }
    #[Route('/administrador/alumnos', name: 'alumnos')]
    public function alumnos(): Response
    {
        $alumnos = $this->consultar('alumno');
        $escuelas = $this->consultar('escuela');
        return $this->render('administrador/alumnos.html.twig', [
            'alumnos' => $alumnos['error'] <> '0' ? [] : (array) $alumnos['datos'],
            'escuelas' => $escuelas['error'] <> '0' ? [] : (array) $escuelas['datos'],
        ]);
    }
    function consultar(string $url): array {
        try {
            $w_url = 'http://localhost/ws_core/public/index.php/'. $url;
            $httpClient = HttpClient::create();
            $response = $httpClient->request('GET', $w_url, [
                'headers' => [
                    'Accept' => 'application/json',
                ],
            ]);
            if ($response->getStatusCode() !== 200) {
                throw new ClientException($response);
            }
            $responseData = $response->toArray();
            return $responseData;
        } catch (ClientException $e) {
            return  ['error' => $e->getCode(), 'mensaje' => $e->getMessage(), 'datos' => []];
        }
    }
}