package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"kalenda-backend/handlers"
	"kalenda-backend/models"
	"kalenda-backend/store"

	"github.com/gorilla/mux"
)

func main() {
	s := store.NewStore()

	// Initialize default event types if store is empty
	if len(s.ListEventTypes()) == 0 {
		defaultTypes := []models.EventType{
			{ID: "15min", Title: "15 Min Meeting", Description: "Quick 15-minute meeting", Duration: 15},
			{ID: "30min", Title: "30 Min Meeting", Description: "Standard 30-minute meeting", Duration: 30},
		}
		for _, et := range defaultTypes {
			s.CreateEventType(et)
		}
		log.Println("Default event types initialized")
	}

	adminHandler := handlers.NewAdminHandler(s)
	publicHandler := handlers.NewPublicHandler(s)

	r := mux.NewRouter()

	// CORS middleware - only in development
	if os.Getenv("GO_ENV") != "production" {
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
	}

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

	// Static files and SPA routing
	staticDir := os.Getenv("STATIC_DIR")
	if staticDir == "" {
		staticDir = "./frontend/dist"
	}

	// Serve static files
	r.PathPrefix("/assets").Handler(http.FileServer(http.Dir(staticDir)))

	// SPA fallback - serve index.html for all non-API routes
	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Don't handle API routes here
		if r.URL.Path == "/" || r.URL.Path == "/admin" || r.URL.Path == "/public" ||
			(!strings.HasPrefix(r.URL.Path, "/admin/") && !strings.HasPrefix(r.URL.Path, "/public/") &&
				!strings.HasPrefix(r.URL.Path, "/api/")) {
			http.ServeFile(w, r, staticDir+"/index.html")
			return
		}
		http.NotFound(w, r)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
