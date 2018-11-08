FROM golang:alpine AS builder
ADD . /go/src/data-backend/

RUN set -ex && \
    cd /go/src/data-backend && \
    ls && \
    CGO_ENABLED=0 go build -a -v && \
    ls && \
    mv ./data-backend /usr/bin/data-backend

FROM busybox
COPY --from=builder /usr/bin/data-backend /usr/local/bin/data-backend
ENTRYPOINT [ "data-backend" ]