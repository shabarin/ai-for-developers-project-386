import { Table, Text } from '@mantine/core';
import type { Booking } from '../types';
import dayjs from 'dayjs';

interface BookingsListProps {
  bookings: Booking[];
  loading?: boolean;
}

export function BookingsList({ bookings, loading }: BookingsListProps) {
  if (loading) return <Text>Loading...</Text>;
  if (bookings.length === 0) return <Text c="dimmed">No bookings yet</Text>;

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Guest</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Duration</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {bookings.map((booking) => (
          <Table.Tr key={booking.id}>
            <Table.Td>{booking.guestName}</Table.Td>
            <Table.Td>{booking.guestEmail}</Table.Td>
            <Table.Td>{dayjs(booking.startAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
            <Table.Td>
              {dayjs(booking.endAt).diff(dayjs(booking.startAt), 'minute')} min
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
