import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Stack } from '@mantine/core';
import { createBooking } from '../../api/bookings';
import { SlotsCalendar } from '../../components/SlotsCalendar';
import { BookingForm } from '../../components/BookingForm';
import type { Slot, CreateBooking } from '../../types';

export function BookPage() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = async (data: CreateBooking) => {
    setLoading(true);
    try {
      const booking = await createBooking(data);
      navigate(`/booking/${booking.id}`);
    } catch {
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!eventTypeId) return <Text>Invalid event type</Text>;

  return (
    <Stack>
      <h1>Book Event</h1>
      {!selectedSlot ? (
        <SlotsCalendar eventTypeId={eventTypeId} onSelectSlot={handleSelectSlot} />
      ) : (
        <BookingForm
          eventTypeId={eventTypeId}
          startAt={selectedSlot.startAt}
          onSubmit={handleBookingSubmit}
          loading={loading}
        />
      )}
    </Stack>
  );
}
