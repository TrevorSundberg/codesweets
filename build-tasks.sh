set -e
eslint --ext .ts .
rm -rf ./dist
node ./bin/sweet-pack-cli.js