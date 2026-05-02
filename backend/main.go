package main

import (
	"log"
	"net/http"
	"os"

	"kalenda-backend/handlers"
	"kalenda-backend/store"

	"github.com/gorilla/mux"
)

func main() {
	s := store.NewStore()
	adminHandler := handlers.NewAdminHandler(s)
	publicHandler := handlers.NewPublicHandler(s)

	r := mux.NewRouter()

	// CORS middleware
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// Admin routes
	admin := r.PathPrefix("/admin").Subrouter()
	admin.HandleFunc("/event-types", adminHandler.ListEventTypes).Methods("GET")
	admin.HandleFunc("/event-types", adminHandler.CreateEventType).Methods("POST")
	admin.HandleFunc("/event-types/{id}", adminHandler.UpdateEventType).Methods("PUT")
	admin.HandleFunc("/event-types/{id}", adminHandler.DeleteEventType).Methods("DELETE")

	admin.HandleFunc("/bookings", adminHandler.ListBookings).Methods("GET")
	admin.HandleFunc("/bookings/{id}", adminHandler.GetBooking).Methods("GET")

	// Public routes
	public := r.PathPrefix("/public").Subrouter()
	public.HandleFunc("/event-types", publicHandler.ListEventTypes).Methods("GET")
	public.HandleFunc("/event-types/{id}/slots", publicHandler.ListSlots).Methods("GET")
	public.HandleFunc("/bookings", publicHandler.CreateBooking).Methods("POST")
	public.HandleFunc("/bookings/{id}", publicHandler.GetBooking).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
