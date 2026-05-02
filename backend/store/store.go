package store

import (
	"sync"
	"time"

	"kalenda-backend/models"
)

type Store struct {
	eventTypes map[string]models.EventType
	bookings   map[string]models.Booking
	mu         sync.RWMutex
}

func NewStore() *Store {
	return &Store{
		eventTypes: make(map[string]models.EventType),
		bookings:   make(map[string]models.Booking),
	}
}

// EventType operations
func (s *Store) CreateEventType(et models.EventType) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.eventTypes[et.ID] = et
}

func (s *Store) GetEventType(id string) (models.EventType, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	et, ok := s.eventTypes[id]
	return et, ok
}

func (s *Store) UpdateEventType(id string, update models.UpdateEventType) (models.EventType, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	et, ok := s.eventTypes[id]
	if !ok {
		return et, false
	}
	if update.Title != nil {
		et.Title = *update.Title
	}
	if update.Description != nil {
		et.Description = *update.Description
	}
	if update.Duration != nil {
		et.Duration = *update.Duration
	}
	s.eventTypes[id] = et
	return et, true
}

func (s *Store) DeleteEventType(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.eventTypes[id]; !ok {
		return false
	}
	delete(s.eventTypes, id)
	return true
}

func (s *Store) ListEventTypes() []models.EventType {
	s.mu.RLock()
	defer s.mu.RUnlock()
	list := make([]models.EventType, 0, len(s.eventTypes))
	for _, et := range s.eventTypes {
		list = append(list, et)
	}
	return list
}

// Booking operations
func (s *Store) CreateBooking(b models.Booking) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.bookings[b.ID] = b
}

func (s *Store) GetBooking(id string) (models.Booking, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	b, ok := s.bookings[id]
	return b, ok
}

func (s *Store) ListBookings() []models.Booking {
	s.mu.RLock()
	defer s.mu.RUnlock()
	list := make([]models.Booking, 0, len(s.bookings))
	for _, b := range s.bookings {
		list = append(list, b)
	}
	return list
}

// Check if a time slot conflicts with existing bookings
func (s *Store) IsSlotAvailable(start, end time.Time) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, b := range s.bookings {
		if start.Before(b.EndAt) && end.After(b.StartAt) {
			return false
		}
	}
	return true
}

// Get all bookings that overlap with a time range
func (s *Store) GetBookingsInRange(start, end time.Time) []models.Booking {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var result []models.Booking
	for _, b := range s.bookings {
		if b.StartAt.Before(end) && b.EndAt.After(start) {
			result = append(result, b)
		}
	}
	return result
}
