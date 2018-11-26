<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\Following;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;
/**
 *
 */
class FollowingController extends Controller
{

  public function __construct(){}

  public function followAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Error following user!!'
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
          $followed = $user_repo->findOneBy(array(
            "id" => $params->following_id
          ));

          $following = new Following();
          $following->setUser($user);
          $following->setFollowed($followed);

          $em->persist($following);
          $flush = $em->flush();

          if ($flush == null) {
            $notification = $this->get("app.notification");
            $notification_res = $notification->set($followed,'Following',$user->getId());
          }

          $data = array(
            'status' => 'success',
            'code' => 200,
            'msg' => 'Following the user!!'
          );
        }
    } else {
        $data = array(
          'status' => $authCheck,
          'code' => $hash,
          'msg' => 'authorization not valid!!'
        );
    }

    return $helpers->json($data);

  }

  public function unfollowAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Error when trying to stop following!!'
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
          $following_repo = $em->getRepository('BackendBundle:Following');
          $followed = $following_repo->findOneBy(array(
            "user" => $user,
            "followed" => $params->following_id
          ));

          $em->remove($followed);
          $em->flush();

          $data = array(
            'status' => 'success',
            'code' => 200,
            'msg' => 'You stopped following!!'
          );
        }
    } else {
        $data = array(
          'status' => $authCheck,
          'code' => $hash,
          'msg' => 'authorization not valid!!'
        );
    }

    return $helpers->json($data);

  }

  public function followingAction(Request $request, $nick = null)
  {
    $helpers = $this->get("app.helpers");
    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Error when trying to stop following!!'
    );

    $em = $this->getDoctrine()->getManager();
    $user_repo = $em->getRepository('BackendBundle:User');
    $user = $user_repo->findOneBy(array(
      "nick" => $nick
    ));

    $following_repo = $em->getRepository('BackendBundle:Following');
    $following = $following_repo->findBy(array(
      "user" => $user
    ));

    $data = array(
      'status' => 'success',
      'code' => 200,
      'following' => $following
    );

    return $helpers->json($data);
  }

  public function followedAction(Request $request, $nick = null)
  {
    $helpers = $this->get("app.helpers");

    $em = $this->getDoctrine()->getManager();
    $user_repo = $em->getRepository('BackendBundle:User');
    $user = $user_repo->findOneBy(array(
      "nick" => $nick
    ));

    $id = $user->getId();
    $dql = "SELECT f FROM BackendBundle:Following f WHERE f.followed = $id ORDER BY f.id";
    $query = $em->CreateQuery($dql);

    $page = $request->query->getInt("page", 1);
    $paginator = $this->get("knp_paginator");
    $items_per_page = 6;

    $followed = $paginator->paginate($query, $page, $items_per_page);
    $total_items_count = $followed->getTotalItemCount();

    $data = array(
      'status' => 'success',
      'total_items_count' => $total_items_count,
      'page_actual' => $page,
      'items_per_page' => $items_per_page,
      'total_pages' => ceil($total_items_count / $items_per_page),
      'followed' => $followed,
      'user' => $user
    );

    return $helpers->json($data);

  }

  public function followingsAction(Request $request, $nick = null)
  {
    $helpers = $this->get("app.helpers");

    $em = $this->getDoctrine()->getManager();
    $user_repo = $em->getRepository('BackendBundle:User');
    $user = $user_repo->findOneBy(array(
      "nick" => $nick
    ));

    $id = $user->getId();
    $dql = "SELECT f FROM BackendBundle:Following f WHERE f.user = $id ORDER BY f.id";
    $query = $em->CreateQuery($dql);

    $page = $request->query->getInt("page", 1);
    $paginator = $this->get("knp_paginator");
    $items_per_page = 6;

    $following = $paginator->paginate($query, $page, $items_per_page);
    $total_items_count = $following->getTotalItemCount();

    $data = array(
      'status' => 'success',
      'total_items_count' => $total_items_count,
      'page_actual' => $page,
      'items_per_page' => $items_per_page,
      'total_pages' => ceil($total_items_count / $items_per_page),
      'following' => $following,
      'user' => $user
    );

    return $helpers->json($data);

  }

}


?>
