import E2eTest from "./src/test/e2e";
import FileCreate from "./src/tasks/file-create";
import GitAdd from "./src/tasks/git-add";
import GitClone from "./src/tasks/git-clone";
import GitCommit from "./src/tasks/git-commit";
import GitHubAuthorization from "./src/tasks/github-authorization";
import GitHubCreateRepository from "./src/tasks/github-create-repository";
import GitPush from "./src/tasks/git-push";
// -import GitRepository from "./src/tasks/git-repository";
import TaskRoot from "./src/core/task-root";

(async () => {
  await E2eTest;

  const root = new TaskRoot();

  new GitHubAuthorization(root, {
    password_or_token: "123",
    username: "TrevorSundberg"
  });
  new GitHubCreateRepository(root, {directory: "/", name: "sample"});
  new GitClone(root);
  new FileCreate(root, {content: "This is is a test", encoding: "utf8", path: "test.txt"});
  new FileCreate(root, {content: "console.log('hello')\nconsole.log('world')", encoding: "utf8", path: "index.js"});
  new GitAdd(root, {filepath: "."});
  new GitCommit(root, {message: "First commit test"});
  new GitPush(root);

  await root.initialize();

  console.log(root.fs.toJSON("/"));

  console.log(JSON.stringify(GitHubCreateRepository.meta.schema));
})();
