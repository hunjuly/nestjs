#! /bin/sh
set -e
cd "$(dirname "$0")"

mkdir -p ../logs
chmod 777 ../logs

cp .env.memory ../.env
