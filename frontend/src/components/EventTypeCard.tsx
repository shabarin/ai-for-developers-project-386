import { Card, Text, Group, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { EventType } from '../types';

interface EventTypeCardProps {
  eventType: EventType;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export function EventTypeCard({ eventType, onSelect, onEdit, onDelete, isAdmin = false }: EventTypeCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ cursor: 'pointer' }}>
      <Group justify="space-between" mb="xs">
        {isAdmin ? (
          <Text fw={500}>{eventType.title}</Text>
        ) : (
          <Text
            fw={500}
            component={Link}
            to={`/book/${eventType.id}`}
            c="inherit"
            style={{ textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            {eventType.title}
          </Text>
        )}
        <Badge>{eventType.duration} min</Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="md">
        {eventType.description}
      </Text>
      <Group>
        {!isAdmin && onSelect && (
          <Text
            size="sm"
            c="blue"
            component={Link}
            to={`/book/${eventType.id}`}
            style={{ textDecoration: 'none' }}
          >
            Book
          </Text>
        )}
        {isAdmin && onEdit && (
          <Text
            size="sm"
            c="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => onEdit(eventType.id)}
          >
            Edit
          </Text>
        )}
        {isAdmin && onDelete && (
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
