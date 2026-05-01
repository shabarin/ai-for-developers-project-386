import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Button } from '@mantine/core';
import { getPublicBooking } from '../../api/bookings';
import type { Booking } from '../../types';
import dayjs from 'dayjs';

export function BookingConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPublicBooking(id).then((data) => {
        setBooking(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!booking) return <Text>Booking not found</Text>;

  return (
    <div>
      <h1>Booking Confirmed!</h1>
      <Text>Guest: {booking.guestName}</Text>
      <Text>Email: {booking.guestEmail}</Text>
      <Text>Date: {dayjs(booking.startAt).format('YYYY-MM-DD HH:mm')}</Text>
      <Text>Duration: {dayjs(booking.endAt).diff(dayjs(booking.startAt), 'minute')} min</Text>
      <Button component="a" href="/" mt="md">
        Back to Home
      </Button>
    </div>
  );
}
