<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/public/event-types/{id}/slots',
            itemUriTemplate: '/public/event-types/{eventTypeId}/slots/{startAt}',
            provider: SlotProvider::class
        )
    ]
)]
class Slot
{
    #[Assert\NotBlank]
    private string $startAt;

    #[Assert\NotBlank]
    private string $endAt;

    #[Assert\NotNull]
    private bool $isAvailable = false;

    public function getStartAt(): string
    {
        return $this->startAt;
    }

    public function setStartAt(string $startAt): self
    {
        $this->startAt = $startAt;
        return $this;
    }

    public function getEndAt(): string
    {
        return $this->endAt;
    }

    public function setEndAt(string $endAt): self
    {
        $this->endAt = $endAt;
        return $this;
    }

    public function isAvailable(): bool
    {
        return $this->isAvailable;
    }

    public function setIsAvailable(bool $isAvailable): self
    {
        $this->isAvailable = $isAvailable;
        return $this;
    }
}
