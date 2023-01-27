package pokerrunde

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/google/uuid"
)

type RESTController struct {
	repo *Repository
}

func NewRestController(repo *Repository) *RESTController {
	return &RESTController{repo: repo}
}

// Routes für das Aggregate Pokerrunde
func (c *RESTController) Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/{rundeID}", c.GetAPokerrunde)
	router.Post("/{rundeID}/command/aufdecken", c.PostCommandAufdecken)
	router.Post("/{rundeID}/command/reset", c.PostCommandReset)

	router.Post("/", c.PostAPokerrunde)

	router.Post("/{rundeID}/mitspieler", c.PostAMitspieler)
	router.Put("/{rundeID}/mitspieler/{mitspielerID}/karte/wert", c.PutAKarteWert)

	return router
}

// GetAPokerrunde liefert eine konkrete Pokerrunde für die Anzeige
func (c *RESTController) GetAPokerrunde(w http.ResponseWriter, r *http.Request) {
	rundeID := chi.URLParam(r, "rundeID")
	spielrunde, ok := c.repo.FindByID(rundeID)
	if !ok {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	render.JSON(w, r, spielrunde)
}

func (p Pokerrunde) Bind(r *http.Request) error {
	return nil
}

// PostAPokerrunde erstellt eine neue Runde
func (c *RESTController) PostAPokerrunde(w http.ResponseWriter, r *http.Request) {
	spielrunde := Pokerrunde{}
	err := render.Bind(r, &spielrunde)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Leere Spielrunde erstellen
	spielrunde.ID = uuid.NewString()
	spielrunde.Mitspieler = []Spieler{}
	spielrunde.KartenWerte = DefaultKartenWerte

	c.repo.Save(spielrunde)

	render.JSON(w, r, spielrunde)
}

func (s Spieler) Bind(r *http.Request) error {
	return nil
}

// PostAPokerrunde erstellt eine neue Runde
func (c *RESTController) PostAMitspieler(w http.ResponseWriter, r *http.Request) {
	rundeID := chi.URLParam(r, "rundeID")
	mitspieler := Spieler{}
	err := render.Bind(r, &mitspieler)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pokerrunde, ok := c.repo.FindByID(rundeID)
	if !ok {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	// aktuell ist keine config für die spielrunde möglich und
	// sie wird mit default werten angelegt
	mitspieler.ID = uuid.NewString()
	mitspieler.Karte = Karte{Aufgedeckt: false, Wert: KarteWertUnbekannt}
	pokerrunde.Mitspieler = append(pokerrunde.Mitspieler, mitspieler)

	c.repo.Save(pokerrunde)

	render.JSON(w, r, mitspieler)
}

func (w KarteWert) Bind(r *http.Request) error {
	for _, wert := range DefaultKartenWerte {
		if wert == w {
			return nil
		}
	}
	return errors.New("Kartenwert wurde nicht gefunden, bitte einen der vorgebenen Werte verwenden")
}

// PutAKarteWert setzt die Karte für einen Spieler
func (c *RESTController) PutAKarteWert(w http.ResponseWriter, r *http.Request) {
	rundeID := chi.URLParam(r, "rundeID")
	mitgliedID := chi.URLParam(r, "mitspielerID")
	wert := KarteWertUnbekannt
	err := render.Bind(r, &wert)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	spielrunde, ok := c.repo.FindByID(rundeID)
	if !ok {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}
	for i, spieler := range spielrunde.Mitspieler {
		if spieler.ID == mitgliedID {
			spielrunde.Mitspieler[i].Karte.Wert = wert
		}
	}

	spielrunde = c.repo.Save(spielrunde)

	render.JSON(w, r, wert)
}

// PostCommandAufdecken deckt alle Karten auf
func (c *RESTController) PostCommandAufdecken(w http.ResponseWriter, r *http.Request) {
	rundeID := chi.URLParam(r, "rundeID")
	spielrunde, ok := c.repo.FindByID(rundeID)
	if !ok {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	for i := range spielrunde.Mitspieler {
		spielrunde.Mitspieler[i].Karte.Aufgedeckt = true
	}

	spielrunde = c.repo.Save(spielrunde)

	w.WriteHeader(http.StatusOK)
}

// PostCommandReset setzt alle Karten zurück
func (c *RESTController) PostCommandReset(w http.ResponseWriter, r *http.Request) {
	rundeID := chi.URLParam(r, "rundeID")
	spielrunde, ok := c.repo.FindByID(rundeID)
	if !ok {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	for i := range spielrunde.Mitspieler {
		spielrunde.Mitspieler[i].Karte.Aufgedeckt = false
		spielrunde.Mitspieler[i].Karte.Wert = KarteWertUnbekannt

	}

	spielrunde = c.repo.Save(spielrunde)

	w.WriteHeader(http.StatusOK)
}
