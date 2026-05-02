package handlers

import (
	"net/http"
	"time"

	"kalenda-backend/models"
	"kalenda-backend/store"

	"github.com/gorilla/mux"
)

type AdminHandler struct {
	store *store.Store
}

func NewAdminHandler(s *store.Store) *AdminHandler {
	return &AdminHandler{store: s}
}

func (h *AdminHandler) ListEventTypes(w http.ResponseWriter, r *http.Request) {
	eventTypes := h.store.ListEventTypes()
	RespondJSON(w, http.StatusOK, eventTypes)
}

func (h *AdminHandler) CreateEventType(w http.ResponseWriter, r *http.Request) {
	var create models.CreateEventType
	if err := DecodeJSON(r, &create); err != nil {
		RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	eventType := models.EventType{
		ID:          create.ID,
		Title:       create.Title,
		Description: create.Description,
		Duration:    create.Duration,
	}

	h.store.CreateEventType(eventType)
	RespondJSON(w, http.StatusOK, eventType)
}

func (h *AdminHandler) UpdateEventType(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		RespondError(w, http.StatusBadRequest, "Missing event type ID")
		return
	}

	var update models.UpdateEventType
	if err := DecodeJSON(r, &update); err != nil {
		RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	eventType, ok := h.store.UpdateEventType(id, update)
	if !ok {
		RespondError(w, http.StatusNotFound, "Event type not found")
		return
	}

	RespondJSON(w, http.StatusOK, eventType)
}

func (h *AdminHandler) DeleteEventType(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		RespondError(w, http.StatusBadRequest, "Missing event type ID")
		return
	}

	if !h.store.DeleteEventType(id) {
		RespondError(w, http.StatusNotFound, "Event type not found")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *AdminHandler) ListBookings(w http.ResponseWriter, r *http.Request) {
	bookings := h.store.ListBookings()
	RespondJSON(w, http.StatusOK, bookings)
}

func (h *AdminHandler) GetBooking(w http.ResponseWriter, r *http.Request) {
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

// Helper to parse time from JSON
func parseTime(s string) (time.Time, error) {
	return time.Parse(time.RFC3339, s)
}
