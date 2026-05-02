<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\EventTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EventTypeRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(uriTemplate: '/admin/event-types'),
        new Post(uriTemplate: '/admin/event-types'),
        new Get(uriTemplate: '/admin/event-types/{id}'),
        new Put(uriTemplate: '/admin/event-types/{id}'),
        new Delete(uriTemplate: '/admin/event-types/{id}'),
        new GetCollection(uriTemplate: '/public/event-types'),
    ]
)]
class EventType
{
    #[ORM\Id]
    #[ORM\Column(type: 'string')]
    #[Assert\NotBlank]
    private string $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    private string $title;

    #[ORM\Column(type: 'string', length: 1000)]
    private string $description = '';

    #[ORM\Column(type: 'integer')]
    #[Assert\Positive]
    private int $duration;

    #[ORM\OneToMany(mappedBy: 'eventType', targetEntity: Booking::class, cascade: ['remove'])]
    private $bookings;

    public function __construct(string $id, string $title, string $description, int $duration)
    {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->duration = $duration;
        $this->bookings = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getDuration(): int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;
        return $this;
    }

    /**
     * @return Collection|Booking[]
     */
    public function getBookings()
    {
        return $this->bookings;
    }
}
