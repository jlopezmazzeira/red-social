<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\PrivateMessage;
use BackendBundle\Entity\User;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;
/**
 *
 */
class PrivateMessageController extends Controller
{

  public function __construct(){}

  public function indexAction(Request $request)
  {
    $helpers = $this->get('app.helpers');

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Message no created!!'
    );

    if ($authCheck == true) {
      $identity = $helpers->authCheck($hash, true);

      $em = $this->getDoctrine()->getManager();
      $user_repo = $em->getRepository('BackendBundle:User');
      $user = $user_repo->findOneBy(array(
        "id" => $identity->sub
      ));

      $message = $request->get("message", null);
      $receiver_id = $request->get("receiver", null);

      if ($message != null && $receiver_id != null) {
          $receiver = $user_repo->findOneBy(array(
            "id" => $receiver_id
          ));

          $private_message = new PrivateMessage();
          $private_message->setMessage($message);
          $private_message->setReaded(0);
          $private_message->setEmitter($user);
          $private_message->setReceiver($receiver);
          $private_message->setCreatedAt(new \Datetime("now"));

          $image = $request->files->get("image");
          if ($image != null && !empty($image)) {
            $ext = $image->guessExtension();
            if ($ext == 'jpeg' || $ext == 'png' || $ext == 'jpg' || $ext == 'gif') {
                $file_name = time().".".$ext;
                $image->move("uploads/message/images", $file_name);
                $private_message->setImage($file_name);
            }
          }

          $document = $request->files->get("file");
          if ($document != null && !empty($document)) {
            $ext = $document->guessExtension();
            if ($ext == 'jpeg' || $ext == 'png' || $ext == 'jpg' || $ext == 'gif') {
                $file_name = time().".".$ext;
                $document->move("uploads/message/documents", $file_name);
                $private_message->setFile($file_name);
            }
          }

          $em->persist($private_message);
          $em->flush();

          $data = array(
            'status' => 'success',
            'code' => 200,
            'msg' => 'New message created!!'
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

  public function sendedAction(Request $request)
  {
    $helpers = $this->get('app.helpers');
    $private_message = $this->getPrivateMessages($request, "sended");
    return $helpers->json($private_message);

  }

  public function receivedAction(Request $request)
  {
    $helpers = $this->get('app.helpers');
    $private_message = $this->getPrivateMessages($request, "received");
    return $helpers->json($private_message);

  }

  private function getPrivateMessages($request, $type = null)
  {
    $helpers = $this->get('app.helpers');

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    if ($authCheck == true) {
      $identity = $helpers->authCheck($hash, true);
      $em = $this->getDoctrine()->getManager();
      $user_repo = $em->getRepository('BackendBundle:User');
      $user = $user_repo->findOneBy(array(
        "id" => $identity->sub
      ));

      $user_id = $identity->sub;

      if ($type == "sended") {
        $dql = "SELECT p FROM BackendBundle:PrivateMessage p WHERE p.emitter = $user_id ORDER BY p.id DESC";
      } else {
        $dql = "SELECT p FROM BackendBundle:PrivateMessage p WHERE p.receiver = $user_id ORDER BY p.id DESC";
        $this->setReaded($em, $user);
      }

      $query = $em->createQuery($dql);
      $paginator = $this->get("knp_paginator");
      $page = $request->query->getInt('page', 1);
      $items_per_page = 5;
      $pagination = $paginator->paginate($query, $page, $items_per_page);
      $total_items_count = $pagination->getTotalItemCount();

      return $data = array(
        'status' => 'success',
        'total_items_count' => $total_items_count,
        'page_actual' => $page,
        'items_per_page' => $items_per_page,
        'total_pages' => ceil($total_items_count / $items_per_page),
        'data' => $pagination,
        'type' => $type
      );

    }

  }

  public function notReadedAction(Request $request)
  {
    $helpers = $this->get('app.helpers');

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    if ($authCheck == true) {
      $identity = $helpers->authCheck($hash, true);
      $em = $this->getDoctrine()->getManager();
      $user_repo = $em->getRepository('BackendBundle:User');
      $user = $user_repo->findOneBy(array(
        "id" => $identity->sub
      ));

      $message_repo = $em->getRepository('BackendBundle:PrivateMessage');
      $messages = count($message_repo->findBy(array(
        "receiver" => $user,
        "readed" => 0
      )));

      $data = array(
        'status' => 'success',
        'code' => 200,
        'data' => $messages
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

  private function setReaded($em, $user)
  {
    $message_repo = $em->getRepository('BackendBundle:PrivateMessage');
    $messages = $message_repo->findBy(array(
      "receiver" => $user,
      "readed" => 0
    ));

    foreach ($messages as $message) {
      $message->setReaded(1);
      $em->persist($message);
    }

    $flush = $em->flush();

    if ($flush == null) {
      return true;
    } else {
      return false;
    }

  }

}


?>
