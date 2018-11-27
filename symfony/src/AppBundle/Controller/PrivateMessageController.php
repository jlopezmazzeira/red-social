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
      'msg' => 'Publication no created!!'
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
            'msg' => 'New publication created!!'
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
