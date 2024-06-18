<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpClient\Exception\ClientException;

class LoginController extends AbstractController
{

    #[Route('/login', name: 'app_login')]
    public function index(): Response
    {
        return $this->render('login/index.html.twig');
    }
    #[Route('/registrar', name: 'app_registrarse')]
    public function registrarse(): Response
    {
        $escuelas = $this->consultar('escuela');
        $roles = $this->consultar('rol');
        return $this->render('login/registrar.html.twig',[
            'escuelas' => $escuelas['error'] <> '0' ? [] : (array) $escuelas['datos'],
            'roles' => $roles['error'] <> '0' ? [] : (array) $roles['datos'],
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