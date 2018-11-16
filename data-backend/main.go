package main

import (
	"log"
	"net/http"
	"os"

	"data-backend/homepage"
	"data-backend/sensor"
	"data-backend/server"
	"data-backend/util"
)

var ServerAddress = util.GetEnv("SERVER_ADDRESS", ":8080")

func main() {
	logger := log.New(os.Stdout, "", log.LstdFlags|log.Lshortfile)

	homeHandler := homepage.NewHandlers(logger)
	sensorHandler := sensor.NewHandlers(logger)

	mux := http.NewServeMux()
	homeHandler.SetupRoutes(mux)
	sensorHandler.SetupRoutes(mux)

	srv := server.New(mux, ServerAddress)

	logger.Println("starting server")
	err := srv.ListenAndServe()
	if err != nil {
		logger.Fatalf("server failed to start: %v", err)
	}
}
