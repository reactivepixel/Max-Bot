#!/bin/bash

# TODO: does not actually create :(
# echo "Creating DB if not exist"
# sequelize db:create --config db/config/config.json

echo "Migrating"
sequelize db:migrate --config db/config/config.json --migrations-path db/migrations/
echo "Seeding"
sequelize db:seed:undo:all --config db/config/config.json --migrations-path db/migrations/ --seeders-path db/seeders
sequelize db:seed:all --config db/config/config.json --migrations-path db/migrations/ --seeders-path db/seeders
echo "Running PM2"
pm2 start max.config.js --no-daemon
