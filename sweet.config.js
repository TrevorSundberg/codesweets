/* eslint-disable sort-keys */
module.exports = {
  entry: {
    "./src/sweet/sweet.ts": {
    },
    "./src/file/file.ts": {
      sweet: "../sweet/sweet"
    },
    "./src/git/git.ts": {
      sweet: "../sweet/sweet",
      file: "../file/file"
    },
    "./src/github/github.ts": {
      sweet: "../sweet/sweet",
      file: "../file/file",
      git: "../git/git"
    },
    "./src/test/test.ts": {
      sweet: "../sweet/sweet"
    },
    "./index.ts": {
      sweet: "./src/sweet/sweet",
      file: "./src/file/file",
      git: "./src/git/git",
      github: "./src/github/github"
    }
  },
  outDir: "bin/tasks"
};
