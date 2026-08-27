#!/bin/bash
set -e

# Start MySQL in the background (using the official entrypoint)
/usr/local/bin/docker-entrypoint.sh mysqld &

# Wait for MySQL to be ready by passing the root password
until mysqladmin ping -h "127.0.0.1" -u root -p"$MYSQL_ROOT_PASSWORD" --silent; do
  echo "Waiting for MySQL to start..."
  sleep 1
done

# Run migrations every time container starts
mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < /db/01_create_db.sql
mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < /db/02_migration_functions.sql
mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < /db/03_migrations.sql

# Bring MySQL to the foreground
wait