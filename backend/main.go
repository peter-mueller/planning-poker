package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/peter-mueller/planning-poker/pokerrunde"

	"github.com/go-chi/render"
)

// Routes sind alle Routen für diesen Service
func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(
		middleware.Logger,
		middleware.RedirectSlashes,
		middleware.Recoverer,
	)

	controller := pokerrunde.NewRestController(pokerrunde.NewRepository())

	router.Route("/v1", func(r chi.Router) {
		r.Use(
			render.SetContentType(render.ContentTypeJSON),
		)
		r.Mount("/api/pokerrunde", controller.Routes())
	})

	router.Handle("/*", http.FileServer(http.Dir("./static/")))
	return router
}

func main() {
	router := Routes()

	if err := chi.Walk(router, printAllRoutes); err != nil {
		log.Panicln(err)
	}

	log.Fatal(http.ListenAndServe(":8080", router))
}

func printAllRoutes(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
	log.Printf("%8s %s\n", method, route) // Walk and print out all routes
	return nil
}
