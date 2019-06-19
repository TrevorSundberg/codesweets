set -e
eslint --ext .ts .
rm -rf ./dist
node ./bin/sweet-pack-cli.js ./src/sweet/sweet.ts
node ./bin/sweet-pack-cli.js ./src/file/file.ts "sweet:../sweet/sweet"
node ./bin/sweet-pack-cli.js ./src/git/git.ts "sweet:../sweet/sweet" "file:../file/file"
node ./bin/sweet-pack-cli.js ./src/github/github.ts "sweet:../sweet/sweet" "file:../file/file" "git:../git/git"
node ./bin/sweet-pack-cli.js ./src/test/test.ts "sweet:../sweet/sweet"
node ./bin/sweet-pack-cli.js ./index.ts "sweet:./src/sweet/sweet" "file:./src/file/file" "git:./src/git/git" "github:./src/github/github"
