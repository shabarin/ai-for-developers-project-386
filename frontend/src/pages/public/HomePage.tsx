import { useEffect, useState } from 'react';
import { SimpleGrid, Title } from '@mantine/core';
import { listPublicEventTypes } from '../../api/eventTypes';
import { EventTypeCard } from '../../components/EventTypeCard';
import type { EventType } from '../../types';

export function HomePage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublicEventTypes().then((data) => {
      setEventTypes(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Title order={1} mb="md">Available Event Types</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {eventTypes.map((et) => (
          <EventTypeCard
            key={et.id}
            eventType={et}
          />
        ))}
      </SimpleGrid>
    </div>
  );
}
