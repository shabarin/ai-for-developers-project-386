import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, SimpleGrid } from '@mantine/core';
import { listAdminEventTypes, deleteEventType } from '../../api/eventTypes';
import { EventTypeCard } from '../../components/EventTypeCard';
import type { EventType } from '../../types';

export function AdminEventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await listAdminEventTypes();
      setEventTypes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event type?')) {
      await deleteEventType(id);
      loadData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Event Types</h1>
        <Button component={Link} to="/admin/event-types/new">
          Create New
        </Button>
      </div>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {eventTypes.map((et) => (
          <EventTypeCard
            key={et.id}
            eventType={et}
            onEdit={(id) => (window.location.href = `/admin/event-types/${id}/edit`)}
            onDelete={handleDelete}
          />
        ))}
      </SimpleGrid>
    </div>
  );
}
