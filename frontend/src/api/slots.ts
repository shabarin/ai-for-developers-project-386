import { apiFetch } from './client';
import type { Slot } from '../types';

export async function listSlots(eventTypeId: string): Promise<Slot[]> {
  return apiFetch<Slot[]>(`/public/event-types/${eventTypeId}/slots`);
}
