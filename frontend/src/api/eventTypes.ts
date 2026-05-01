import { apiFetch } from './client';
import type { EventType, CreateEventType, UpdateEventType } from '../types';

export async function listPublicEventTypes(): Promise<EventType[]> {
  return apiFetch<EventType[]>('/public/event-types');
}

export async function listAdminEventTypes(): Promise<EventType[]> {
  return apiFetch<EventType[]>('/admin/event-types');
}

export async function createEventType(data: CreateEventType): Promise<EventType> {
  return apiFetch<EventType>('/admin/event-types', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateEventType(id: string, data: UpdateEventType): Promise<EventType> {
  return apiFetch<EventType>(`/admin/event-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteEventType(id: string): Promise<void> {
  return apiFetch<void>(`/admin/event-types/${id}`, {
    method: 'DELETE',
  });
}
