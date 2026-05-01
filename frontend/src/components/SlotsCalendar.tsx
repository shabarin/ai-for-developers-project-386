import { useState } from 'react';
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

  const loadSlots = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSlots(eventTypeId);
      setSlots(data);
      filterSlotsByDate(data, date);
    } catch {
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const filterSlotsByDate = (allSlots: Slot[], date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const filtered = allSlots.filter(
      (slot) =>
        dayjs(slot.startAt).format('YYYY-MM-DD') === dateStr && slot.isAvailable
    );
    setAvailableSlots(filtered);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const dateObj = new Date(date);
    if (slots.length === 0) {
      loadSlots(dateObj);
    } else {
      filterSlotsByDate(slots, dateObj);
    }
  };

  return (
    <>
      <Calendar
        date={selectedDate || new Date()}
        onDateChange={handleDateChange}
        minDate={new Date()}
        maxDate={dayjs().add(14, 'day').toDate()}
      />
      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}
      {selectedDate && !loading && (
        <>
          <Text mt="md" fw={500}>
            Available slots for {selectedDate}:
          </Text>
          <Group mt="sm">
            {availableSlots.length === 0 && <Text c="dimmed">No available slots</Text>}
            {availableSlots.map((slot) => (
              <Button
                key={slot.startAt}
                variant="outline"
                onClick={() => onSelectSlot(slot)}
              >
                {dayjs(slot.startAt).format('HH:mm')}
              </Button>
            ))}
          </Group>
        </>
      )}
    </>
  );
}
