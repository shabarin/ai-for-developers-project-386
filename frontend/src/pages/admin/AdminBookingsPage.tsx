import { useEffect, useState } from 'react';
import { listAdminBookings } from '../../api/bookings';
import { listAdminEventTypes } from '../../api/eventTypes';
import { BookingsList } from '../../components/BookingsList';
import type { Booking, EventType } from '../../types';
import dayjs from 'dayjs';

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypesMap, setEventTypesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listAdminBookings(), listAdminEventTypes()]).then(
      ([bookingsData, eventTypesData]) => {
        const now = dayjs();
        const upcoming = bookingsData
          .filter((b) => dayjs(b.startAt).isAfter(now) || dayjs(b.startAt).isSame(now, 'minute'))
          .sort((a, b) => dayjs(a.startAt).diff(dayjs(b.startAt)));
        setBookings(upcoming);

        const map: Record<string, string> = {};
        eventTypesData.forEach((et: EventType) => {
          map[et.id] = et.title;
        });
        setEventTypesMap(map);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div>
      <h1>Upcoming Bookings</h1>
      <BookingsList bookings={bookings} eventTypesMap={eventTypesMap} loading={loading} />
    </div>
  );
}
