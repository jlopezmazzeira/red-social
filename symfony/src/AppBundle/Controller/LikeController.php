<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\Like;
use BackendBundle\Entity\User;
use BackendBundle\Entity\Publication;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 *
 */
class LikeController extends Controller
{

  public function likeAction(Request $request, $id = null){
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

        $publication_repo = $em->getRepository('BackendBundle:Publication');
        $publication = $publication_repo->findOneBy(array(
          "user" => $user,
          "id" => $id
        ));

        $like = new Like();
        $like->setUser($user);
        $like->setPublication($publication);
        $em->persist($like);
        $em->flush();

        $data = array(
          'status' => 'success',
          'code' => 200,
          'msg' => 'Deleted publication!!'
        );
    } else {
        $data = array(
          'status' => 'error',
          'code' => 400,
          'msg' => 'authorization not valid!!'
        );
    }

    return $helpers->json($data);
  }

  public function unlikeAction(Request $request, $id = null){
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

        $like_repo = $em->getRepository('BackendBundle:Like');
        $like = $like_repo->findOneBy(array(
          "user" => $user,
          "publication" => $id
        ));

        $em->remove($like);
        $em->flush();

        $data = array(
          'status' => 'success',
          'code' => 200,
          'msg' => 'Deleted publication!!'
        );
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
