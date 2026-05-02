package utils

import (
	"math/rand"
	"time"

	"kalenda-backend/models"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func GenerateID() string {
	const charset = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 16)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

func GenerateBookingID() string {
	return "booking-" + GenerateID()
}

// GenerateSlots generates available slots for 14 days starting from now
// Working hours: 9:00 - 17:00 UTC
// Slot duration is determined by the event type
func GenerateSlots(eventType models.EventType, existingBookings []models.Booking) []models.Slot {
	now := time.Now().UTC()
	slots := []models.Slot{}

	// Generate slots for 14 days
	for day := 0; day < 14; day++ {
		date := time.Date(now.Year(), now.Month(), now.Day()+day, 0, 0, 0, 0, time.UTC)

		// Start at 9:00 UTC
		startHour := 9
		endHour := 17

		for hour := startHour; hour < endHour; hour++ {
			for minute := 0; minute < 60; minute += int(eventType.Duration) {
				if minute+int(eventType.Duration) > 60 {
					break
				}

				slotStart := time.Date(date.Year(), date.Month(), date.Day(), hour, minute, 0, 0, time.UTC)
				slotEnd := slotStart.Add(time.Duration(eventType.Duration) * time.Minute)

				// Skip past slots
				if slotStart.Before(now) {
					continue
				}

				// Check if slot is available
				isAvailable := true
				for _, booking := range existingBookings {
					if slotStart.Before(booking.EndAt) && slotEnd.After(booking.StartAt) {
						isAvailable = false
						break
					}
				}

				slots = append(slots, models.Slot{
					StartAt:     slotStart,
					EndAt:       slotEnd,
					IsAvailable: isAvailable,
				})
			}
		}
	}

	return slots
}

// TimeToJSON converts time to JSON string (RFC3339)
func TimeToJSON(t time.Time) string {
	return t.Format(time.RFC3339)
}
