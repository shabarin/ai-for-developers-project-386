import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { TextInput, NumberInput, Button, Stack } from '@mantine/core';
import { createEventType, updateEventType, listAdminEventTypes } from '../../api/eventTypes';
import type { CreateEventType, UpdateEventType } from '../../types';

export function EventTypeFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;

  const form = useForm({
    initialValues: {
      id: '',
      title: '',
      description: '',
      duration: 30,
    },
    validate: {
      id: (value: string) => (!isEdit && value.length < 1 ? 'ID is required' : null),
      title: (value: string) => (value.length < 1 ? 'Title is required' : null),
      duration: (value: number) => (value < 1 ? 'Duration must be positive' : null),
    },
  });

  useEffect(() => {
    if (id) {
      listAdminEventTypes().then((types) => {
        const et = types.find((t) => t.id === id);
        if (et) {
          form.setValues({
            id: et.id,
            title: et.title,
            description: et.description,
            duration: et.duration,
          });
        }
      });
    }
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        const updateData: UpdateEventType = {
          title: values.title,
          description: values.description,
          duration: values.duration,
        };
        await updateEventType(id, updateData);
      } else {
        await createEventType(values as CreateEventType);
      }
      navigate('/admin');
    } catch {
      alert('Failed to save event type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <h1>{isEdit ? 'Edit Event Type' : 'Create Event Type'}</h1>
        {!isEdit && (
          <TextInput
            label="ID"
            placeholder="evt-consultation"
            required
            {...form.getInputProps('id')}
          />
        )}
        <TextInput
          label="Title"
          placeholder="Consultation"
          required
          {...form.getInputProps('title')}
        />
        <TextInput
          label="Description"
          placeholder="30-minute consultation call"
          {...form.getInputProps('description')}
        />
        <NumberInput
          label="Duration (minutes)"
          min={1}
          required
          {...form.getInputProps('duration')}
        />
        <Button type="submit" loading={loading}>
          Save
        </Button>
      </Stack>
    </form>
  );
}
