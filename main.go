package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/peter-mueller/planning-poker/pokerrunde"

	"github.com/go-chi/render"
)

//go:embed static/*
var static embed.FS

type Server struct {
	repo *pokerrunde.Repository
}

// Routes sind alle Routen für diesen Service
func (s *Server) Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(
		middleware.RedirectSlashes,
		middleware.Recoverer,
	)

	controller := pokerrunde.NewRestController(s.repo)

	router.Route("/v1", func(r chi.Router) {
		r.Use(
			render.SetContentType(render.ContentTypeJSON),
		)
		r.Mount("/api/pokerrunde", controller.Routes())
	})

	content, err := fs.Sub(static, "static")
	if err != nil {
		log.Fatal(err)
	}

	router.Handle("/*", http.FileServer(http.FS(content)))
	return router
}

func main() {
	server := Server{}
	server.repo = pokerrunde.NewRepository()

	go server.Tasks()

	router := server.Routes()

	if err := chi.Walk(router, printAllRoutes); err != nil {
		log.Panicln(err)
	}

	port, ok := os.LookupEnv("PLANNINGPOKER_PORT")
	if !ok {
		port = "8080"
	}

	log.Printf("Starting on port: %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func (s *Server) Tasks() {
	cleanTicker := time.NewTicker(time.Minute)
	for {
		select {
		case <-cleanTicker.C:
			t := time.Now().Add(-24 * time.Hour)
			log.Printf(
				"Pokerrunden erstellt vor %s werden jetzt gelöscht",
				t.String(),
			)
			s.repo.RemoveAllErstelltVor(t)
		}
	}
}

func printAllRoutes(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
	log.Printf("%8s %s\n", method, route) // Walk and print out all routes
	return nil
}
