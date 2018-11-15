<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\User;
use BackendBundle\Entity\Publication;
use Symfony\Component\HttpFoundation\JsonResponse;
/**
 *
 */
class PublicationController extends Controller
{

  public function createAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Publication no created!!'
    );

    if ($authCheck == true) {
        $identity = $helpers->authCheck($hash, true);

        $em = $this->getDoctrine()->getManager();
        $user_repo = $em->getRepository('BackendBundle:User');
        $user = $user_repo->findOneBy(array(
          "id" => $identity->sub
        ));

        $json = $request->get("json", null);
        $params = json_decode($json);

        if ($json != null) {
            $message = (isset($params->message)) ? $params->message : null;
            if ($message != null) {
                $publication = new Publication();
                $publication->setText($message);
                $publication->setStatus("1");
                $publication->setUser($user);
                $publication->setCreatedAt(new \Datetime("now"));
                $em->persist($publication);
                $em->flush();

                $data = array(
                  'status' => 'success',
                  'code' => 200,
                  'msg' => 'New publication created!!'
                );
            }
        }
    } else {
        $data = array(
          'status' => 'error',
          'code' => 400,
          'msg' => 'authorization not valid!!'
        );
    }

    return $helpers->json($data);
  }

  public function deleteAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'The post could not be deleted'
    );

    if ($authCheck == true) {
        $identity = $helpers->authCheck($hash, true);

        $em = $this->getDoctrine()->getManager();
        $user_repo = $em->getRepository('BackendBundle:User');
        $user = $user_repo->findOneBy(array(
          "id" => $identity->sub
        ));

        $json = $request->get("json", null);
        $params = json_decode($json);

        if ($json != null) {
            $publication_repo = $em->getRepository('BackendBundle:Publication');
            $publication = $publication_repo->findOneBy(array(
              "user" => $user,
              //"followed" => $params->following_id
            ));

            $em->remove($publication);
            $em->flush();

            $data = array(
              'status' => 'success',
              'code' => 200,
              'msg' => 'Deleted publication!!'
            );
        }

    } else {
        $data = array(
          'status' => 'error',
          'code' => 400,
          'msg' => 'authorization not valid!!'
        );
    }

    return $helpers->json($data);
  }
}


?>
