package sensor

import (
	"data-backend/util"
	"github.com/influxdata/influxdb/client/v2"
	"log"
	"net/http"
)

type Handlers struct {
	logger *log.Logger
}

type Result struct {
}

func (h *Handlers) GetReadings(w http.ResponseWriter, r *http.Request) {

	ExampleClient(h.logger)

	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Hello from golang"))
}

func (h *Handlers) SetupRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/readings", util.Logger(h.GetReadings, h.logger))
}

func NewHandlers(logger *log.Logger) *Handlers {
	return &Handlers{
		logger: logger,
	}
}

func ExampleClient(logger *log.Logger) []Result {
	c, err := client.NewHTTPClient(client.HTTPConfig{
		Addr:     "Addr",
		Username: "sensor",
		Password: "Password",
	})

	if err != nil {
		logger.Printf("error creating connection to influxdb: %v", err)
	}

	defer c.Close()

	q := client.NewQuery("SELECT * from plant where nodeid=3", "plants", "ns")
	response, err := c.Query(q)

	if err != nil {
		logger.Printf("error when querying influxdb: %v", err)
	}
	return convertResults(response)
}

func convertResults(response *client.Response) []Result {
	return nil
}
