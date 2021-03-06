FROM golang:1.16-alpine AS go-build
WORKDIR /src/
COPY ./backend/ /src/
RUN CGO_ENABLED=0 go build -o /bin/planning-poker

FROM node:16-alpine AS lit-build
WORKDIR /web/
COPY ./frontend/ /web/
RUN npm install
RUN npm run build

FROM scratch
COPY --from=go-build /bin/planning-poker /bin/planning-poker
COPY --from=lit-build /web/dist/* /bin/static/
WORKDIR /bin/
EXPOSE 8080
ENTRYPOINT ["/bin/planning-poker"]