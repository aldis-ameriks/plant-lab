package main

import (
	"log"
	"net/http"
	"os"

	"data-backend/homepage"
	"data-backend/server"
)

var ServerAddress = getEnv("SERVER_ADDRESS", ":8080")

func main() {
	logger := log.New(os.Stdout, "", log.LstdFlags|log.Lshortfile)

	h := homepage.NewHandlers(logger)

	mux := http.NewServeMux()
	h.SetupRoutes(mux)

	srv := server.New(mux, ServerAddress)

	logger.Println("starting server")
	err := srv.ListenAndServe()
	if err != nil {
		logger.Fatalf("server failed to start: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
