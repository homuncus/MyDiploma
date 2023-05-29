FROM postgres:12.5

# If you need POSTGRES_MULTIPLE_DATABASES
# COPY ./docker/postgres/create-multiple-postgresql-databases.sh /docker-entrypoint-initdb.d

# If you need install DB extensions
COPY ./docker/postgres/extensions.sql /docker-entrypoint-initdb.d
