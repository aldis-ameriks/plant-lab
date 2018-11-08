package server

import (
	"net/http"
	"reflect"
	"testing"
	"time"
)

func TestNew(t *testing.T) {
	mux := http.NewServeMux()
	serverAddress := "1.2.3.4:8080"

	type args struct {
		mux           *http.ServeMux
		serverAddress string
	}

	tests := []struct {
		name string
		args args
		want *http.Server
	}{
		{
			name: "good",
			args: args{
				mux:           mux,
				serverAddress: serverAddress,
			},
			want: &http.Server{
				Addr:         serverAddress,
				ReadTimeout:  5 * time.Second,
				WriteTimeout: 10 * time.Second,
				IdleTimeout:  120 * time.Second,
				Handler:      mux,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := New(tt.args.mux, tt.args.serverAddress); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("New() = %v, want %v", got, tt.want)
			}
		})
	}
}
