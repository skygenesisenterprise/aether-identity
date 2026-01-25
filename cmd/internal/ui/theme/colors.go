package theme

// Colors définit la palette de couleurs
type Colors struct {
	Reset   string
	Border  string
	Header  string
	Title   string
	Logo    string
	Info    string
	User    string
	Time    string
	Success string
	Warning string
	Error   string
}

// GetColors retourne la palette de couleurs par défaut
func GetColors() *Colors {
	return &Colors{
		Reset:   "\033[0m",
		Border:  "\033[90m", // Gris foncé
		Header:  "\033[94m", // Bleu
		Title:   "\033[96m", // Cyan
		Logo:    "\033[92m", // Vert
		Info:    "\033[93m", // Jaune
		User:    "\033[95m", // Magenta
		Time:    "\033[97m", // Blanc
		Success: "\033[32m", // Vert
		Warning: "\033[33m", // Jaune
		Error:   "\033[31m", // Rouge
	}
}
