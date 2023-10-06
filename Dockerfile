ARG GO_VERSION=1.21

FROM golang:${GO_VERSION}-alpine AS server-builder
ARG GITHUB_SHA
ARG GITHUB_REF
RUN apk add --no-cache ca-certificates tzdata make gcc musl-dev
WORKDIR /src
COPY go.mod go.sum Makefile ./
RUN go mod download
COPY cmd ./cmd
COPY internal ./internal
RUN CGO_ENABLED=1 make build

FROM scratch
USER 1000
WORKDIR /app
COPY --from=server-builder /src/bin/server /app/server
COPY --from=server-builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=server-builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
CMD ["/app/server"]
