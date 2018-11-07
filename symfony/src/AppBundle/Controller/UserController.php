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
    $helpers = $this->get("app.helpers");

    $json = $request->get("json", null);
    $params = json_decode($json);

    $data = array(
      'status' => 'error',
      'code' => 400,
      'msg' => 'User not created!!'
    );

    return $helpers->json($data);
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
          $factory = $this->get("security.encoder_factory");
          $encoder = $factory->getEncoder($user);

          $password = $encoder->encodePassword($password, $user->getSalt());

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
}


?>
