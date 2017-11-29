#!/bin/bash

echo "Generating Sequelize config from .env file"
gulp db
echo "Generating PM2 config from .env file"
gulp pm2
echo "Migrating"
sequelize db:migrate --config db/config/config.json --migrations-path db/migrations/
echo "Seeding"
# TODO: Seed based upon Environment
# sequelize db:seed:undo:all --config db/config/config.json --migrations-path db/migrations/ --seeders-path db/seeders
# sequelize db:seed:all --config db/config/config.json --migrations-path db/migrations/ --seeders-path db/seeders
echo "Running PM2"
pm2 start max.config.js --no-daemon
