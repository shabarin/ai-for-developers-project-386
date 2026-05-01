import { Card, Text, Group, Badge } from '@mantine/core';
import type { EventType } from '../types';

interface EventTypeCardProps {
  eventType: EventType;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EventTypeCard({ eventType, onSelect, onEdit, onDelete }: EventTypeCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{eventType.title}</Text>
        <Badge>{eventType.duration} min</Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="md">
        {eventType.description}
      </Text>
      <Group>
        {onSelect && (
          <Text
            size="sm"
            c="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(eventType.id)}
          >
            Book
          </Text>
        )}
        {onEdit && (
          <Text
            size="sm"
            c="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => onEdit(eventType.id)}
          >
            Edit
          </Text>
        )}
        {onDelete && (
          <Text
            size="sm"
            c="red"
            style={{ cursor: 'pointer' }}
            onClick={() => onDelete(eventType.id)}
          >
            Delete
          </Text>
        )}
      </Group>
    </Card>
  );
}
