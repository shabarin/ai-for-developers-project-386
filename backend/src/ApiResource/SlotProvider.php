<?php

namespace App\ApiResource;

use ApiPlatform\State\ProviderInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\EventType;
use App\Entity\Booking;
use App\Repository\EventTypeRepository;
use App\Repository\BookingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Clock\ClockAwareTrait;

class SlotProvider implements ProviderInterface
{
    use ClockAwareTrait;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private EventTypeRepository $eventTypeRepository,
        private BookingRepository $bookingRepository
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $eventTypeId = $uriVariables['id'] ?? null;
        if (!$eventTypeId) {
            throw new NotFoundHttpException('Event type not found');
        }

        $eventType = $this->eventTypeRepository->find($eventTypeId);
        if (!$eventType) {
            throw new NotFoundHttpException('Event type not found');
        }

        $now = new \DateTimeImmutable();
        $endDate = $now->modify('+14 days');
        
        $slots = [];
        $currentDate = $now;
        
        while ($currentDate <= $endDate) {
            $dayStart = $currentDate->setTime(9, 0); // 9 AM start
            $dayEnd = $currentDate->setTime(17, 0); // 5 PM end
            
            $slotStart = $dayStart;
            while ($slotStart < $dayEnd) {
                $slotEnd = $slotStart->modify('+' . $eventType->getDuration() . ' minutes');
                
                // Check if slot is available (no overlapping bookings)
                $overlappingBookings = $this->bookingRepository->findOverlappingBookings($slotStart, $slotEnd);
                $isAvailable = count($overlappingBookings) === 0;
                
                $slots[] = [
                    'startAt' => $slotStart->format('c'),
                    'endAt' => $slotEnd->format('c'),
                    'isAvailable' => $isAvailable,
                ];
                
                $slotStart = $slotEnd;
            }
            
            $currentDate = $currentDate->modify('+1 day')->setTime(9, 0);
        }
        
        return $slots;
    }
}
