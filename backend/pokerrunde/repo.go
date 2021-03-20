package pokerrunde

import (
	"sync"

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

func (r *Repository) Save(p Pokerrunde) Pokerrunde {

	if p.ID == "" {
		p.ID = uuid.NewString()
	}

	r.lock.Lock()
	defer r.lock.Unlock()
	r.pokerrunden[p.ID] = p

	return p
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
