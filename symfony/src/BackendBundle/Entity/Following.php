<?php

namespace BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Following
 *
 * @ORM\Table(name="following", indexes={@ORM\Index(name="fk_following_users", columns={"user"}), @ORM\Index(name="fk_followed", columns={"followed"})})
 * @ORM\Entity
 */
class Following
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var \User
     *
     * @ORM\ManyToOne(targetEntity="Users")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="followed", referencedColumnName="id")
     * })
     */
    private $followed;

    /**
     * @var \User
     *
     * @ORM\ManyToOne(targetEntity="Users")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user", referencedColumnName="id")
     * })
     */
    private $user;



    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set followed
     *
     * @param \BackendBundle\Entity\User $followed
     *
     * @return Following
     */
    public function setFollowed(\BackendBundle\Entity\User $followed = null)
    {
        $this->followed = $followed;

        return $this;
    }

    /**
     * Get followed
     *
     * @return \BackendBundle\Entity\User
     */
    public function getFollowed()
    {
        return $this->followed;
    }

    /**
     * Set user
     *
     * @param \BackendBundle\Entity\User $user
     *
     * @return Following
     */
    public function setUser(\BackendBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \BackendBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
}
