package util

import (
	"log"
	"net/http"
	"os"
	"time"
)

func Logger(next http.HandlerFunc, logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		defer logger.Printf("request processed in %s\n", time.Now().Sub(startTime))
		next(w, r)
	}
}

func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
