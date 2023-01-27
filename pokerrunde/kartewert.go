package pokerrunde

type KarteWert string

const KarteWertUnbekannt = KarteWert("")

var DefaultKartenWerte = []KarteWert{
	KarteWertUnbekannt,
	"?", "0", "1", "2", "3", "5", "8",
	"13", "21", "34", "55", "84",
	"☕",
}
