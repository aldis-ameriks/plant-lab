package util

import (
	"log"
	"net/http"
	"time"
)

func Logger(next http.HandlerFunc, logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		defer logger.Printf("request processed in %s\n", time.Now().Sub(startTime))
		next(w, r)
	}
}
