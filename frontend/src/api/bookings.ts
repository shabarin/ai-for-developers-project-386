import { apiFetch } from './client';
import type { Booking, CreateBooking } from '../types';

export async function listAdminBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>('/admin/bookings');
}

export async function getPublicBooking(id: string): Promise<Booking> {
  return apiFetch<Booking>(`/public/bookings/${id}`);
}

export async function createBooking(data: CreateBooking): Promise<Booking> {
  return apiFetch<Booking>('/public/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
