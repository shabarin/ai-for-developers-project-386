<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\BookingRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BookingRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(uriTemplate: '/admin/bookings'),
        new Get(uriTemplate: '/admin/bookings/{id}'),
        new Post(uriTemplate: '/public/bookings'),
        new Get(uriTemplate: '/public/bookings/{id}'),
    ]
)]
class Booking
{
    #[ORM\Id]
    #[ORM\Column(type: 'string')]
    private string $id;

    #[ORM\ManyToOne(targetEntity: EventType::class, inversedBy: 'bookings')]
    #[ORM\JoinColumn(nullable: false)]
    private EventType $eventType;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    private string $guestName;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\Email]
    #[Assert\NotBlank]
    private string $guestEmail;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $startAt;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $endAt;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    public function __construct(
        string $id,
        EventType $eventType,
        string $guestName,
        string $guestEmail,
        \DateTimeImmutable $startAt,
        \DateTimeImmutable $endAt
    ) {
        $this->id = $id;
        $this->eventType = $eventType;
        $this->guestName = $guestName;
        $this->guestEmail = $guestEmail;
        $this->startAt = $startAt;
        $this->endAt = $endAt;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getEventTypeId(): string
    {
        return $this->eventType->getId();
    }

    public function getGuestName(): string
    {
        return $this->guestName;
    }

    public function getGuestEmail(): string
    {
        return $this->guestEmail;
    }

    public function getStartAt(): \DateTimeImmutable
    {
        return $this->startAt;
    }

    public function getEndAt(): \DateTimeImmutable
    {
        return $this->endAt;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
