FROM mysql:latest

COPY ./goldtours.sql /docker-entrypoint-initdb.d/

# docker run --name goldtours-db -d -e MYSQL_ALLOW_EMPTY_PASSWORD=1 -e MYSQL_DATABASE=goldtours -e MYSQL_TCP_PORT=3306 -p 3308:3306 goldtours-db:1.0.0
