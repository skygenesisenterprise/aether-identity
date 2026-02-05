# Dockerfile.dev pour Aether Identity Server
# Utilise pour le developpement avec hot-reload
# Contexte: repertoire server/ (racine du projet server)

FROM golang:1.25.5-alpine AS builder

WORKDIR /app

# Copier les fichiers go depuis le contexte local
COPY go.mod go.sum ./

# Telecharger les dependances
RUN go mod download

# Copier le code source
COPY . .

# Construire l'application
RUN go build -o identity-server main.go

# Image finale legere
FROM alpine:latest

# Installer les dependances necessaires
RUN apk add --no-cache ca-certificates wget

# Copier l'application construite
COPY --from=builder /app/identity-server /identity-server

# Exposer le port
EXPOSE 8080

# Commande par defaut
CMD ["/identity-server"]
