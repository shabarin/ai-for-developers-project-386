import { Table, Text } from '@mantine/core';
import type { Booking } from '../types';
import dayjs from 'dayjs';

interface BookingsListProps {
  bookings: Booking[];
  eventTypesMap: Record<string, string>;
  loading?: boolean;
}

export function BookingsList({ bookings, eventTypesMap, loading }: BookingsListProps) {
  if (loading) return <Text>Loading...</Text>;
  if (bookings.length === 0) return <Text c="dimmed">No bookings yet</Text>;

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Event Type</Table.Th>
          <Table.Th>Guest</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Date</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {bookings.map((booking) => (
          <Table.Tr key={booking.id}>
            <Table.Td>{eventTypesMap[booking.eventTypeId] || 'Unknown'}</Table.Td>
            <Table.Td>{booking.guestName}</Table.Td>
            <Table.Td>{booking.guestEmail}</Table.Td>
            <Table.Td>{dayjs(booking.startAt).format('YYYY-MM-DD HH:mm')}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
