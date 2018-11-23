<?php

namespace AppBundle\Controller;

//use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\User;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\JsonResponse;
/**
 *
 */
class UserController extends Controller
{

  public function __construct(){}

  public function loginAction(Request $request)
  {
    $helpers = $this->get('app.helpers');
    $jwtAuth = $this->get('app.jwt_auth');

    $json = $request->get("json", null);

    if ($json != null) {
      $params = json_decode($json);

      $email = (isset($params->email)) ? $params->email : null;
      $password = (isset($params->password)) ? $params->password : null;
      $getHash = (isset($params->gethash)) ? $params->gethash : null;

      $emailContraint = new Assert\Email();
      $emailContraint->message = "This email is not valid!";

      $validateEmail = $this->get("validator")->validate($email, $emailContraint);

      //cifrar password
      $pwd = hash('sha256', $password);

      if (count($validateEmail) == 0 && $password != null) {

        if ($getHash == null || !$getHash) {
          $signup = $jwtAuth->signup($email, $pwd, false);
        } else {
          $signup = $jwtAuth->signup($email, $pwd, true);
        }

        return new JsonResponse($signup);
      } else {
        return $helpers->json(array(
          'status' => 'error',
          'data' => 'Login not valid!!'
        ));

      }
    } else {
      return $helpers->json(array(
        'status' => 'error',
        'data' => 'Send json with post!!'
      ));
    }
  }

  public function registerAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $json = $request->get("json", null);
    $params = json_decode($json);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'User not created!!'
    );

    if ($json != null) {
      $email = (isset($params->email)) ? $params->email : null;
      $role = "user";
      $name = (isset($params->name) && ctype_alpha($params->name)) ? $params->name : null;
      $surname = (isset($params->surname) && ctype_alpha($params->surname)) ? $params->surname : null;
      $password = (isset($params->password)) ? $params->password : null;
      $nick = (isset($params->nick)) ? $params->nick : null;
      $active = "1";

      $emailContraint = new Assert\Email();
      $emailContraint->message = "This email is not valid!";

      $validateEmail = $this->get("validator")->validate($email, $emailContraint);

      if (count($validateEmail) == 0 && $email != null && $password != null && $name != null && $surname != null && $nick != null) {
        $em = $this->getDoctrine()->getManager();

        $query = $em->createQuery('SELECT u FROM BackendBundle:User u WHERE u.email = :email or u.nick = :nick')
                    ->setParameter('email', $params->email)
                    ->setParameter('nick', $params->nick);

        $userIsset = $query->getResult();
        if (count($userIsset) == 0) {
          $user = new User();
          $password = hash('sha256', $password);

          $user->setRole($role);
          $user->setName($name);
          $user->setSurname($surname);
          $user->setNick($nick);
          $user->setEmail($email);
          $user->setPassword($password);
          $user->setImage(null);
          $user->setBio(null);
          $user->setActive($active);

          $em->persist($user);
          $em->flush();

          $data = array(
            'status' => 'success',
            'code' => 200,
            'msg' => 'New user created!!'
          );
        } else {
          $data = array(
            'status' => 'error',
            'code' => 400,
            'msg' => 'User not created, duplicated!!'
          );
        }

      }

    }
    return $helpers->json($data);
  }

  public function nickTestAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $json = $request->get("json", null);
    $params = json_decode($json);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Nick duplicated!!'
    );

    if ($json != null) {
      $nick = (isset($params->nick)) ? $params->nick : null;
      $em = $this->getDoctrine()->getManager();
      $userRepo = $em->getRepository("BackendBundle:User");
      $userIsset = $userRepo->findBy(array('nick' => $nick));

      if (count($userIsset) == 0) {
        $data = array(
          'status' => 'success',
          'code' => 200,
          'msg' => 'Nick unused!!'
        );
      }

    }

    return $helpers->json($data);
  }

  public function editUserAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'Nick duplicated!!'
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
        $data = array(
          'status' => 'error',
          'code' => 400,
          'msg' => 'User not updated!!'
        );

        if ($json != null) {
          $email = (isset($params->email)) ? $params->email : null;
          $name = (isset($params->name) && ctype_alpha($params->name)) ? $params->name : null;
          $surname = (isset($params->surname) && ctype_alpha($params->surname)) ? $params->surname : null;
          $nick = (isset($params->nick)) ? $params->nick : null;
          $bio = (isset($params->bio)) ? $params->bio : null;
          $password = (isset($params->password)) ? $params->password : null;

          $emailContraint = new Assert\Email();
          $emailContraint->message = "This email is not valid!";

          $validateEmail = $this->get("validator")->validate($email, $emailContraint);

          if (count($validateEmail) == 0 && $email != null && $name != null && $surname != null && $nick != null) {
            $em = $this->getDoctrine()->getManager();

            $query = $em->createQuery('SELECT u FROM BackendBundle:User u WHERE u.email = :email or u.nick = :nick')
                        ->setParameter('email', $params->email)
                        ->setParameter('nick', $params->nick);

            $userIsset = $query->getResult();
            if (($identity->email == $user->getEmail() && $identity->nick == $user->getNick()) || count($userIsset) == 0) {
              $user->setName($name);
              $user->setSurname($surname);
              $user->setNick($nick);
              $user->setEmail($email);
              $user->setBio($bio);

              if ($password != null && !empty($password) && $password != $identity->password) {
                //cifrar password
                $pwd = hash('sha256', $password);
                $user->setPassword($pwd);
              }

              $em->persist($user);
              $em->flush();

              $data = array(
                'status' => 'success',
                'code' => 200,
                'user' => $user,
                'msg' => 'User updated!!'
              );
            } else {
              $data = array(
                'status' => 'error',
                'code' => 400,
                'msg' => 'User not updated!!'
              );
            }
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

  public function uploadImageAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $hash = $request->get("authorization", null);
    $authCheck = $helpers->authCheck($hash);

    if ($authCheck == true) {
      $identity = $helpers->authCheck($hash, true);

      $em = $this->getDoctrine()->getManager();
      $user_repo = $em->getRepository('BackendBundle:User');
      $user = $user_repo->findOneBy(array(
        "id" => $identity->sub
      ));

      //upload file
      $file = $request->files->get("image");

      if ($file != null && !empty($file)) {
        $ext = $file->guessExtension();
        if ($ext == 'jpeg' || $ext == 'png' || $ext == 'jpg' || $ext == 'gif') {
          $file_name = time().".".$ext;
          $file->move("uploads/users", $file_name);

          $user->setImage($file_name);
          $em->persist($user);
          $em->flush();

          $data = array(
            'status' => 'success',
            'code' => 200,
            'user' => $user,
            'msg' => 'Image for user upload success!!'
          );
        } else {
          $data = array(
            'status' => 'error',
            'code' => 200,
            'msg' => 'File not valid!!'
          );
        }

      } else {
        $data = array(
          'status' => 'error',
          'code' => 400,
          'msg' => 'Image not uploaded!!'
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

  public function usersAction(Request $request)
  {
    $helpers = $this->get("app.helpers");

    $em = $this->getDoctrine()->getManager();
    $query = $em->createQuery('SELECT u FROM BackendBundle:User u');

    $page = $request->query->getInt("page", 1);
    $paginator = $this->get("knp_paginator");
    $items_per_page = 2;

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

    return $helpers->json($data);
  }

  public function searchAction(Request $request, $search = null)
  {
    $helpers = $this->get("app.helpers");

    $em = $this->getDoctrine()->getManager();

    if ($search != null) {
      $search = trim($search);
      $dql = "SELECT u FROM BackendBundle:User u WHERE u.name LIKE :search OR u.surname LIKE :search OR u.nick LIKE :search ORDER BY u.id DESC";
      $query = $em->createQuery($dql)->setParameter("search", "%$search%");
    } else {
      $dql = "SELECT u FROM BackendBundle:User u ORDER BY u.id DESC";
      $query = $em->createQuery($dql);
    }

    $page = $request->query->getInt("page", 1);
    $paginator = $this->get("knp_paginator");
    $items_per_page = 6;

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

    return $helpers->json($data);

  }

  public function profileAction(Request $request, $nickname = null)
  {
    $helpers = $this->get("app.helpers");
    
    $em = $this->getDoctrine()->getManager();

    $user_repo = $em->getRepository('BackendBundle:User');
    $user = $user_repo->findOneBy(array(
      "nick" => $nickname
    ));

    $id = $user->getId();
    $dql = "SELECT p FROM BackendBundle:Publication p WHERE p.user = $id ORDER BY p.id";
    $query = $em->CreateQuery($dql);

    $page = $request->query->getInt("page", 1);
    $paginator = $this->get("knp_paginator");
    $items_per_page = 6;

    $publications = $paginator->paginate($query, $page, $items_per_page);
    $total_items_count = $publications->getTotalItemCount();

    $data = array(
      'status' => 'success',
      'total_items_count' => $total_items_count,
      'page_actual' => $page,
      'items_per_page' => $items_per_page,
      'total_pages' => ceil($total_items_count / $items_per_page),
      'publications' => $publications,
      'user' => $user
    );

    return $helpers->json($data);

  }
}


?>
