package pokerrunde

import "time"

// Pokerrunde ist eine Session für eine Planning Poker
type Pokerrunde struct {
	ID          string `json:"id"`
	ErstellZeit time.Time

	Mitspieler  []Spieler   `json:"mitspieler"`
	KartenWerte []KarteWert `json:"kartenwerte"`
}

// Spieler ist ein Mitspieler der Pokerrunde der eine Karte legen kann
type Spieler struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Karte Karte  `json:"karte"`
}

// Karte ist eine Spielkarte
type Karte struct {
	Aufgedeckt bool      `json:"aufgedeckt"`
	Wert       KarteWert `json:"wert"`
}
