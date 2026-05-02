package handlers

import (
	"net/http"
	"time"

	"kalenda-backend/models"
	"kalenda-backend/store"
	"kalenda-backend/utils"

	"github.com/gorilla/mux"
)

type PublicHandler struct {
	store *store.Store
}

func NewPublicHandler(s *store.Store) *PublicHandler {
	return &PublicHandler{store: s}
}

func (h *PublicHandler) ListEventTypes(w http.ResponseWriter, r *http.Request) {
	eventTypes := h.store.ListEventTypes()
	RespondJSON(w, http.StatusOK, eventTypes)
}

func (h *PublicHandler) ListSlots(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		RespondError(w, http.StatusBadRequest, "Missing event type ID")
		return
	}

	eventType, ok := h.store.GetEventType(id)
	if !ok {
		RespondError(w, http.StatusNotFound, "Event type not found")
		return
	}

	// Get all existing bookings for availability check
	bookings := h.store.ListBookings()

	// Generate slots for the next 14 days
	slots := utils.GenerateSlots(eventType, bookings)

	RespondJSON(w, http.StatusOK, slots)
}

func (h *PublicHandler) CreateBooking(w http.ResponseWriter, r *http.Request) {
	var create models.CreateBooking
	if err := DecodeJSON(r, &create); err != nil {
		RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Verify event type exists
	eventType, ok := h.store.GetEventType(create.EventTypeId)
	if !ok {
		RespondError(w, http.StatusNotFound, "Event type not found")
		return
	}

	// Parse times
	startAt := create.StartAt
	endAt := startAt.Add(time.Duration(eventType.Duration) * time.Minute)

	// Create booking (atomically checks slot availability)
	booking := models.Booking{
		ID:          utils.GenerateBookingID(),
		EventTypeId: create.EventTypeId,
		GuestName:   create.GuestName,
		GuestEmail:  create.GuestEmail,
		StartAt:     startAt,
		EndAt:       endAt,
		CreatedAt:   time.Now().UTC(),
	}

	if !h.store.CreateBooking(booking) {
		RespondError(w, http.StatusConflict, "Slot is not available")
		return
	}

	RespondJSON(w, http.StatusOK, booking)
}

func (h *PublicHandler) GetBooking(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		RespondError(w, http.StatusBadRequest, "Missing booking ID")
		return
	}

	booking, ok := h.store.GetBooking(id)
	if !ok {
		RespondError(w, http.StatusNotFound, "Booking not found")
		return
	}

	RespondJSON(w, http.StatusOK, booking)
}
