# Dockerfile pour Aether Identity Server (Production)
# Contexte: repertoire server/

FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o identity-server -ldflags="-s -w" main.go

FROM alpine:latest

RUN apk add --no-cache ca-certificates wget
COPY --from=builder /app/identity-server /identity-server

USER 1000:1000

EXPOSE 8080

CMD ["/identity-server"]
