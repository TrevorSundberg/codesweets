set -e
eslint --ext .ts .
rm -rf ./bin
tsc