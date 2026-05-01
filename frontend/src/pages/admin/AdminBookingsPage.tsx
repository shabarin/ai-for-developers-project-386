import { useEffect, useState } from 'react';
import { listAdminBookings } from '../../api/bookings';
import { BookingsList } from '../../components/BookingsList';
import type { Booking } from '../../types';

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Upcoming Bookings</h1>
      <BookingsList bookings={bookings} loading={loading} />
    </div>
  );
}
