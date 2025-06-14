FROM node:18.12.1-alpine3.16 AS builder

# Install git
RUN apk update && \
    apk --no-cache add git

FROM builder

RUN mkdir -p /app/ && \
    mkdir -p /.npm-cache/ && \
    echo "cache=/.npm-cache" > /.npmrc && \
    chmod 755 -R /.npmrc && \
    chmod 777 -R /.npm-cache
    
COPY app/ /app/

RUN chmod 755 -R /app && \
    chown root:root -R /app && \
    cd /app && npm install

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod 750 /app/entrypoint.sh

ENTRYPOINT "/app/entrypoint.sh"
