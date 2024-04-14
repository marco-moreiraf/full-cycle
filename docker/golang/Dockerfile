FROM golang:latest AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -ldflags="-s -w" main.go

FROM scratch
WORKDIR /app
COPY --from=builder /app/main .
CMD [ "./main" ]


# FROM scratch

# COPY go-docker /

# CMD [ "/go-docker" ]