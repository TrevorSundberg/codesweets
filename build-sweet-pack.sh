set -e
eslint --ext .ts .
rm -rf ./bin/sweet-pack
tsc