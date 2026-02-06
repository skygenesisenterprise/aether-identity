# Étape 1: Build
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache git openssh-keygen iproute2

# Copier les fichiers de dépendances
COPY go.mod go.sum ./
RUN go mod download

# Copier le code source
COPY main.go ./

# Compiler l'application (sans CGO pour Alpine)
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o aether-console ./main.go

# Étape 2: Image finale légère
FROM alpine:latest

RUN apk --no-cache add ca-certificates iproute2 openssh-keygen bash

WORKDIR /root/

# Copier le binaire depuis l'étape de build
COPY --from=builder /app/aether-console .

# Rendre le binaire exécutable
RUN chmod +x ./aether-console

# Définir le binaire comme shell par défaut
# Cela permettra d'avoir la console au démarrage
CMD ["./aether-console"]
