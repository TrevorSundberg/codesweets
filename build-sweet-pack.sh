set -e
echo "\n#### Building sweet-pack ####\n"
eslint --ext .ts .
rm -rf ./bin/sweet-pack
tsc