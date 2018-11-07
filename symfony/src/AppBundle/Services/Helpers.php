<?php

namespace AppBundle\Services;
/**
 *
 */
class Helpers
{
  public $jwt_auth;

  public function __construct($jwt_auth)
  {
    $this->jwt_auth = $jwt_auth;
  }

  public function authCheck($has, $getIdentity = false)
  {
    $jwt_auth = $this->jwt_auth;
    $auth  = false;

    if ($has != null) {
      if ($getIdentity == false) {
        $check_token = $jwt_auth->checkToken($has);

        if ($check_token == true) {
          $auth = true;
        }
      } else {
        $check_token = $jwt_auth->checkToken($has, true);

        if (is_object($check_token)) {
          $auth = $check_token;
        }
      }
    }

    return $auth;

  }

  public function json($data)
  {
    $normalizes = array(new \Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer());
    $encoders = array('json' => new \Symfony\Component\Serializer\Encoder\JsonEncoder());

    $serializer = new \Symfony\Component\Serializer\Serializer($normalizes, $encoders);
    $json = $serializer->serialize($data, 'json');

    $response = new \Symfony\Component\HttpFoundation\Response();
    $response->setContent($json);
    $response->headers->set("content-type","application/json");

    return $response;
  }
}

?>
