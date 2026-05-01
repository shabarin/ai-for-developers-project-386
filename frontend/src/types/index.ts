export interface EventType {
  id: string;
  title: string;
  description: string;
  duration: number;
}

export interface CreateEventType {
  id: string;
  title: string;
  description: string;
  duration: number;
}

export interface UpdateEventType {
  title?: string;
  description?: string;
  duration?: number;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  startAt: string;
  endAt: string;
  createdAt: string;
}

export interface CreateBooking {
  eventTypeId: string;
  startAt: string;
  guestName: string;
  guestEmail: string;
}

export interface Slot {
  startAt: string;
  endAt: string;
  isAvailable: boolean;
}
