#!/bin/bash
set -e

# Start MySQL in the background (using the official entrypoint)
/usr/local/bin/docker-entrypoint.sh mysqld &

# Wait for MySQL to be ready
until mysqladmin ping -h "localhost" --silent; do
  sleep 1
done

# Run migrations every time container starts
mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /db/02_migration_functions.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /db/03_migrations.sql

# Bring MySQL to the foreground
wait
