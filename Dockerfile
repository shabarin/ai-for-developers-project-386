# Stage 1: Build frontend
FROM node:24-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Go backend
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /kalenda main.go

# Stage 3: Final image
FROM alpine:3.19

RUN apk --no-cache add ca-certificates
RUN adduser -D -g '' appuser

WORKDIR /app
COPY --from=backend-builder /kalenda /app/kalenda
COPY --from=frontend-builder /app/frontend/dist /app/static

RUN chown -R appuser:appuser /app
USER appuser

ENV STATIC_DIR=/app/static
ENV GO_ENV=production

EXPOSE 8080

CMD ["/app/kalenda"]
