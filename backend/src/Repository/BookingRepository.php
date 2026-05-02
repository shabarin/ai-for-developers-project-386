<?php

namespace App\Repository;

use App\Entity\Booking;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    /**
     * Find bookings that overlap with given time range
     */
    public function findOverlappingBookings(\DateTimeImmutable $startAt, \DateTimeImmutable $endAt): array
    {
        return $this->createQueryBuilder('b')
            ->where('b.startAt < :endAt')
            ->andWhere('b.endAt > :startAt')
            ->setParameter('startAt', $startAt)
            ->setParameter('endAt', $endAt)
            ->getQuery()
            ->getResult();
    }
}
