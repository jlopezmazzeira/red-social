<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\User;
use BackendBundle\Entity\Publication;
use BackendBundle\Entity\Following;
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

        $message = $request->get("message", null);

        if ($message != null) {
            $publication = new Publication();
            $publication->setText($message);
            $publication->setStatus("1");
            $publication->setUser($user);
            $publication->setCreatedAt(new \Datetime("now"));

            $image = $request->files->get("image");
            if ($image != null && !empty($image)) {
              $ext = $image->guessExtension();
              if ($ext == 'jpeg' || $ext == 'png' || $ext == 'jpg' || $ext == 'gif') {
                  $file_name = time()."_image.".$ext;
                  $image->move("uploads/publications/images", $file_name);
                  $publication->setImage($file_name);
              }
            }

            $document = $request->files->get("document");
            if ($document != null && !empty($document)) {
              $ext = $document->guessExtension();
              if ($ext == 'jpeg' || $ext == 'png' || $ext == 'jpg' || $ext == 'gif') {
                  $file_name = time()."_document.".$ext;
                  $document->move("uploads/publications/documents", $file_name);
                  $publication->setDocument($file_name);
              }
            }

            $em->persist($publication);
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

  public function deleteAction(Request $request, $id = null)
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

        //$json = $request->get("json", null);
        //$params = json_decode($json);

        //if ($json != null) {
            $publication_repo = $em->getRepository('BackendBundle:Publication');
            $publication = $publication_repo->find(array(
              "user" => $user,
              "id" => $id
            ));

            $em->remove($publication);
            $em->flush();

            $data = array(
              'status' => 'success',
              'code' => 200,
              'msg' => 'Deleted publication!!'
            );
        //}

    } else {
        $data = array(
          'status' => 'error',
          'code' => 400,
          'msg' => 'authorization not valid!!'
        );
    }

    return $helpers->json($data);
  }

  public function listAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Could not load the posts'
    );

    if ($authCheck == true) {
        $identity = $helpers->authCheck($hash, true);

        $em = $this->getDoctrine()->getManager();
        $user_repo = $em->getRepository('BackendBundle:User');
        $user = $user_repo->findOneBy(array(
          "id" => $identity->sub
        ));

        $publication_repo = $em->getRepository('BackendBundle:Publication');
        $following_repo = $em->getRepository('BackendBundle:Following');

        $following = $following_repo->findBy(array('user' => $user));

        $following_array = array();

        foreach ($following as $follow) {
          $following_array = $follow->getFollowed();
        }

        $query = $publication_repo->CreateQueryBuilder('p')
                                  ->where('p.user = (:user_id) OR p.user IN (:following)')
                                  ->setParameter('user_id', $identity->sub)
                                  ->setParameter('following', $following_array)
                                  ->orderBy('p.id', 'DESC')
                                  ->getQuery();

        $paginator = $this->get("knp_paginator");
        $page = $request->query->getInt('page', 1);
        $items_per_page = 5;
        $pagination = $paginator->paginate($query, $page, $items_per_page);
        $total_items_count = $pagination->getTotalItemCount();

        $data = array(
          'status' => 'success',
          'total_items_count' => $total_items_count,
          'page_actual' => $page,
          'items_per_page' => $items_per_page,
          'total_pages' => ceil($total_items_count / $items_per_page),
          'data' => $pagination
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
