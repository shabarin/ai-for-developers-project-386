<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Booking;
use App\Entity\EventType;
use App\Repository\BookingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class BookingProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private BookingRepository $bookingRepository
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Booking) {
            return $data;
        }

        // Check if event type exists
        $eventType = $this->entityManager->getRepository(EventType::class)->find($data->getEventTypeId());
        if (!$eventType) {
            throw new BadRequestHttpException('Event type not found');
        }

        // Check for overlapping bookings (all event types)
        $overlapping = $this->bookingRepository->findOverlappingBookings(
            $data->getStartAt(),
            $data->getEndAt()
        );

        if (count($overlapping) > 0) {
            throw new BadRequestHttpException('Time slot is already booked');
        }

        return $data;
    }
}
