import { useState, useEffect } from 'react';
import { Calendar } from '@mantine/dates';
import { Text, Loader, Alert, Group, Button } from '@mantine/core';
import { listSlots } from '../api/slots';
import type { Slot } from '../types';
import dayjs from 'dayjs';

interface SlotsCalendarProps {
  eventTypeId: string;
  onSelectSlot: (slot: Slot) => void;
}

export function SlotsCalendar({ eventTypeId, onSelectSlot }: SlotsCalendarProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  const loadSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSlots(eventTypeId);
      setSlots(data);
    } catch {
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [eventTypeId]);

  useEffect(() => {
    if (!selectedDate || slots.length === 0) {
      setAvailableSlots([]);
      return;
    }
    const dateNormalized = dayjs(selectedDate).format('YYYY-MM-DD');
    const filtered = slots.filter(
      (slot) =>
        dayjs(slot.startAt).format('YYYY-MM-DD') === dateNormalized && slot.isAvailable
    );
    setAvailableSlots(filtered);
  }, [selectedDate, slots]);

  const handleSlotClick = (slot: Slot) => {
    onSelectSlot(slot);
  };

  return (
    <div data-testid="slots-calendar">
      <Calendar
        getDayProps={(date) => ({
          onClick: () => {
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            setSelectedDate(dateStr);
          },
        })}
        minDate={new Date()}
        maxDate={dayjs().add(14, 'day').toDate()}
      />

      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}

      {!loading && slots.length === 0 && (
        <Text c="dimmed" mt="md">No slots available for this event type.</Text>
      )}

      {selectedDate && !loading && (
        <>
          <Text mt="md" fw={500}>
            Available slots for {dayjs(selectedDate).format('YYYY-MM-DD')}:
          </Text>
          <Group mt="sm">
            {availableSlots.length === 0 && slots.length > 0 && (
              <Text c="dimmed">
                No available slots for this date. Try another date.
              </Text>
            )}
            {availableSlots.map((slot) => (
              <Button
                key={slot.startAt}
                variant="outline"
                onClick={() => handleSlotClick(slot)}
                data-testid="slot-button"
              >
                {dayjs(slot.startAt).format('HH:mm')}
              </Button>
            ))}
          </Group>
        </>
      )}

      {slots.length > 0 && (
        <Text mt="md" size="sm" c="dimmed">
          Total slots: {slots.length}, Available: {slots.filter(s => s.isAvailable).length}
        </Text>
      )}
    </div>
  );
}
