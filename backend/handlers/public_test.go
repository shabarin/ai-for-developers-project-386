package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"kalenda-backend/models"
	"kalenda-backend/store"
)

func setupTestStore() *store.Store {
	s := store.NewStore()
	// Add event type
	s.CreateEventType(models.EventType{
		ID:          "evt-1",
		Title:       "Consultation",
		Description: "30 min",
		Duration:    30,
	})
	return s
}

func TestCreateBooking_SlotAlreadyBooked(t *testing.T) {
	s := setupTestStore()
	h := NewPublicHandler(s)

	// First booking
	start := time.Now().UTC().Add(24 * time.Hour).Truncate(time.Minute)

	booking1 := models.CreateBooking{
		EventTypeId: "evt-1",
		StartAt:     start,
		GuestName:   "Alice",
		GuestEmail:  "alice@example.com",
	}
	body, _ := json.Marshal(booking1)
	req := httptest.NewRequest(http.MethodPost, "/public/bookings", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.CreateBooking(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("first booking should succeed, got %d", w.Code)
	}

	// Try to book the same slot
	booking2 := models.CreateBooking{
		EventTypeId: "evt-1",
		StartAt:     start,
		GuestName:   "Bob",
		GuestEmail:  "bob@example.com",
	}
	body2, _ := json.Marshal(booking2)
	req2 := httptest.NewRequest(http.MethodPost, "/public/bookings", bytes.NewReader(body2))
	req2.Header.Set("Content-Type", "application/json")
	w2 := httptest.NewRecorder()
	h.CreateBooking(w2, req2)

	if w2.Code != http.StatusConflict {
		t.Fatalf("second booking should fail with 409, got %d", w2.Code)
	}
}

func TestCreateBooking_OverlappingSlot(t *testing.T) {
	s := setupTestStore()
	h := NewPublicHandler(s)

	start := time.Now().UTC().Add(24 * time.Hour).Truncate(time.Minute)

	// Book the slot
	booking1 := models.CreateBooking{
		EventTypeId: "evt-1",
		StartAt:     start,
		GuestName:   "Alice",
		GuestEmail:  "alice@example.com",
	}
	body, _ := json.Marshal(booking1)
	req := httptest.NewRequest(http.MethodPost, "/public/bookings", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	h.CreateBooking(w, req)

	// Try to book overlapping slot (starts 15 min later, same event type)
	overlappingStart := start.Add(15 * time.Minute)
	booking2 := models.CreateBooking{
		EventTypeId: "evt-1",
		StartAt:     overlappingStart,
		GuestName:   "Bob",
		GuestEmail:  "bob@example.com",
	}
	body2, _ := json.Marshal(booking2)
	req2 := httptest.NewRequest(http.MethodPost, "/public/bookings", bytes.NewReader(body2))
	req2.Header.Set("Content-Type", "application/json")
	w2 := httptest.NewRecorder()
	h.CreateBooking(w2, req2)

	if w2.Code != http.StatusConflict {
		t.Fatalf("overlapping booking should fail with 409, got %d", w2.Code)
	}
}
