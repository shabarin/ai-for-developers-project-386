package models

import "time"

type EventType struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Duration    int32  `json:"duration"`
}

type CreateEventType struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Duration    int32  `json:"duration"`
}

type UpdateEventType struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Duration    *int32  `json:"duration,omitempty"`
}

type Booking struct {
	ID          string    `json:"id"`
	EventTypeId string    `json:"eventTypeId"`
	GuestName   string    `json:"guestName"`
	GuestEmail  string    `json:"guestEmail"`
	StartAt     time.Time `json:"startAt"`
	EndAt       time.Time `json:"endAt"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CreateBooking struct {
	EventTypeId string    `json:"eventTypeId"`
	StartAt     time.Time `json:"startAt"`
	GuestName   string    `json:"guestName"`
	GuestEmail  string    `json:"guestEmail"`
}

type Slot struct {
	StartAt     time.Time `json:"startAt"`
	EndAt       time.Time `json:"endAt"`
	IsAvailable bool      `json:"isAvailable"`
}
