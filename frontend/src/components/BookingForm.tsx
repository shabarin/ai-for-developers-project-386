import { TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { CreateBooking } from '../types';

interface BookingFormProps {
  eventTypeId: string;
  startAt: string;
  onSubmit: (data: CreateBooking) => void;
  loading?: boolean;
}

export function BookingForm({ eventTypeId, startAt, onSubmit, loading }: BookingFormProps) {
  const form = useForm({
    initialValues: {
      guestName: '',
      guestEmail: '',
    },
    validate: {
      guestName: (value: string) => (value.length < 2 ? 'Name is too short' : null),
      guestEmail: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onSubmit({
      eventTypeId,
      startAt,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <div style={{ fontSize: '14px' }}>Booking for: {new Date(startAt).toLocaleString()}</div>
        <TextInput
          label="Your Name"
          placeholder="John Doe"
          required
          {...form.getInputProps('guestName')}
        />
        <TextInput
          label="Email"
          placeholder="john@example.com"
          required
          {...form.getInputProps('guestEmail')}
        />
        <Button type="submit" loading={loading}>
          Confirm Booking
        </Button>
      </Stack>
    </form>
  );
}
