set -e
echo "\n#### Building tasks ####\n"
eslint --ext .ts .
rm -rf ./bin/tasks
node ./bin/sweet-pack/sweet-pack-cli.js