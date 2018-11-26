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
      'msg' => 'Error!!'
    );

    if ($authCheck == true) {
        $identity = $helpers->authCheck($hash, true);

        $em = $this->getDoctrine()->getManager();
        $user_repo = $em->getRepository('BackendBundle:User');
        $user = $user_repo->findOneBy(array(
          "id" => $identity->sub
        ));

        $publication_repo = $em->getRepository('BackendBundle:Publication');
        $publication = $publication_repo->find($id);

        $like = new Like();
        $like->setUser($user);
        $like->setPublication($publication);
        $em->persist($like);
        $flush = $em->flush();

        if ($flush == null) {
          $notification = $this->get("app.notification");
          $notification_res = $notification->set($user,'Like',$publication->getUser()->getId(),$publication->getId());
        }

        $data = array(
          'status' => 'success',
          'code' => 200,
          'msg' => 'I like!!'
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
      'msg' => 'Error!!'
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
          'msg' => 'I dont like!!'
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

  public function likesAction(Request $request, $nick = null)
  {
    $helpers = $this->get("app.helpers");

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Error when trying to stop likes!!'
    );

    $em = $this->getDoctrine()->getManager();
    $user_repo = $em->getRepository('BackendBundle:User');
    $user = $user_repo->findOneBy(array(
      "nick" => $nick
    ));

    $like_repo = $em->getRepository('BackendBundle:Like');
    $like = $like_repo->findBy(array(
      "user" => $user
    ));

    $data = array(
      'status' => 'success',
      'code' => 200,
      'likes' => $like
    );

    return $helpers->json($data);
  }

  public function likePublicationsAction(Request $request, $nick = null)
  {
    $helpers = $this->get("app.helpers");

    $em = $this->getDoctrine()->getManager();
    $user_repo = $em->getRepository('BackendBundle:User');
    $user = $user_repo->findOneBy(array(
      "nick" => $nick
    ));

    $id = $user->getId();
    $dql = "SELECT l FROM BackendBundle:Like l WHERE l.user = $id ORDER BY l.id";
    $query = $em->CreateQuery($dql);

    $page = $request->query->getInt("page", 1);
    $paginator = $this->get("knp_paginator");
    $items_per_page = 6;

    $likes = $paginator->paginate($query, $page, $items_per_page);
    $total_items_count = $likes->getTotalItemCount();

    $data = array(
      'status' => 'success',
      'total_items_count' => $total_items_count,
      'page_actual' => $page,
      'items_per_page' => $items_per_page,
      'total_pages' => ceil($total_items_count / $items_per_page),
      'likes' => $likes,
      'user' => $user
    );

    return $helpers->json($data);

  }

}


?>
