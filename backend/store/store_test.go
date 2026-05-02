package store

import (
	"testing"
	"time"

	"kalenda-backend/models"
)

func TestCreateBooking_SlotConflict(t *testing.T) {
	s := NewStore()

	start := time.Now().UTC().Add(24 * time.Hour).Truncate(time.Minute)
	end := start.Add(30 * time.Minute)

	// Create first booking
	b1 := models.Booking{
		ID:          "booking-1",
		EventTypeId: "evt-1",
		StartAt:     start,
		EndAt:       end,
	}
	if !s.CreateBooking(b1) {
		t.Fatal("first booking should succeed")
	}

	// Try to create overlapping booking (same start)
	b2 := models.Booking{
		ID:          "booking-2",
		EventTypeId: "evt-1",
		StartAt:     start,
		EndAt:       end,
	}
	if s.CreateBooking(b2) {
		t.Fatal("overlapping booking (same start) should fail")
	}

	// Try to create overlapping booking (partial overlap)
	b3 := models.Booking{
		ID:          "booking-3",
		EventTypeId: "evt-1",
		StartAt:     start.Add(15 * time.Minute), // overlaps by 15 min
		EndAt:       start.Add(45 * time.Minute),
	}
	if s.CreateBooking(b3) {
		t.Fatal("partially overlapping booking should fail")
	}

	// Non-overlapping booking should succeed
	b4 := models.Booking{
		ID:          "booking-4",
		EventTypeId: "evt-1",
		StartAt:     end, // starts exactly when b1 ends
		EndAt:       end.Add(30 * time.Minute),
	}
	if !s.CreateBooking(b4) {
		t.Fatal("non-overlapping booking should succeed")
	}
}
