package pokerrunde

import (
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Repository struct {
	pokerrunden map[string]Pokerrunde
	lock        sync.RWMutex
}

func NewRepository() *Repository {
	return &Repository{
		pokerrunden: make(map[string]Pokerrunde),
		lock:        sync.RWMutex{},
	}
}

func (r *Repository) Create(p Pokerrunde) (Pokerrunde, error) {

	p.ID = uuid.NewString()
	p.ErstellZeit = time.Now()

	r.lock.Lock()
	defer r.lock.Unlock()
	r.pokerrunden[p.ID] = p

	return p, nil
}

var ErrKeineID = errors.New("Pokerrunde hat keine ID")
var ErrNotFound = errors.New("Pokerrunde nicht gefunden")

func (r *Repository) Update(p Pokerrunde) (Pokerrunde, error) {
	if p.ID == "" {
		return p, ErrKeineID
	}

	r.lock.Lock()
	defer r.lock.Unlock()
	alt, ok := r.pokerrunden[p.ID]
	if !ok {
		return p, ErrNotFound
	}
	p.ErstellZeit = alt.ErstellZeit
	r.pokerrunden[p.ID] = p

	return p, nil
}

func (r *Repository) FindByID(uuid string) (p Pokerrunde, ok bool) {
	r.lock.RLock()
	defer r.lock.RUnlock()
	pokerrunde, ok := r.pokerrunden[uuid]

	if !ok {
		return Pokerrunde{}, false
	}
	return pokerrunde, true
}

func (r *Repository) RemoveAllErstelltVor(zeit time.Time) {
	r.lock.Lock()
	defer r.lock.Unlock()

	for id, runde := range r.pokerrunden {
		if runde.ErstellZeit.Before(zeit) {
			delete(r.pokerrunden, id)
		}
	}
}