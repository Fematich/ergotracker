#!/command/with-contenv bashio
set -e

DATA_DIR="/data/ergotracker"

bashio::log.info "Ensuring ${DATA_DIR} exists for persistent SQLite storage"
mkdir -p "${DATA_DIR}"
chmod 755 "${DATA_DIR}"
