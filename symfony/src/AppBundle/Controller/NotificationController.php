<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\Notification;
use BackendBundle\Entity\User;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;
/**
 *
 */
class NotificationController extends Controller
{

  public function __construct(){}

  public function indexAction(Request $request)
  {
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

        $id = $user->getId();
        $dql = "SELECT n FROM BackendBundle:Notification n WHERE n.user = $id ORDER BY n.id";
        $query = $em->CreateQuery($dql);

        $page = $request->query->getInt("page", 1);
        $paginator = $this->get("knp_paginator");
        $items_per_page = 6;

        $notifications = $paginator->paginate($query, $page, $items_per_page);
        $total_items_count = $notifications->getTotalItemCount();

        $notification = $this->get("app.notification");
        $notification_res = $notification->read($user);

        $data = array(
          'status' => 'success',
          'total_items_count' => $total_items_count,
          'page_actual' => $page,
          'items_per_page' => $items_per_page,
          'total_pages' => ceil($total_items_count / $items_per_page),
          'notification' => $notifications,
          'user' => $user
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

  public function countNotificationsAction(Request $request)
  {
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

        $em = $this->getDoctrine()->getManager();
        $notification_repo = $em->getRepository('BackendBundle:Notification');
        $notifications = $notification_repo->findby(array(
          "user" => $user,
          "readed" => 0)
        );

        $data = array(
          'status' => 'success',
          'code' => 200,
          'data' => $notifications
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
