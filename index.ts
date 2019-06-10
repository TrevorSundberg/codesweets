import E2eTest from "./src/test/e2e";
import FileCreate from "./src/tasks/file-create";
import GitAddCommitPush from "./src/tasks/git-add-commit-push";
import GitClone from "./src/tasks/git-clone";
import GitHubAuthorization from "./src/tasks/github-authorization";
import GitHubCreateRepository from "./src/tasks/github-create-repository";
import TaskRoot from "./src/core/task-root";

(async () => {
  await E2eTest;

  const root = new TaskRoot();

  const png =
    "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAJ0lEQVR42mP4/5/h" +
    "Pz7MQJQCBgYIhgsi8RmItgLdBKwKkDFpjsSHAasyq1WQq/GGAAAAAElFTkSuQmCC";

  new GitHubAuthorization(root, {password_or_token: process.env.PASS, username: process.env.USER});
  new GitHubCreateRepository(root, {directory: "/", name: "sample"});
  new GitClone(root);
  new FileCreate(root, {content: "This is is a test", encoding: "utf8", path: "README.md"});
  new FileCreate(root, {content: png, encoding: "base64", path: "test.png"});
  new FileCreate(root, {content: "console.log('hello')\nconsole.log('world')", encoding: "utf8", path: "index.js"});
  new GitAddCommitPush(root, {add_path: ".", message: "First commit test"});

  await root.initialize();

  console.log(root.fs.toJSON("/"));

  console.log(JSON.stringify(GitHubCreateRepository.meta.schema));
})();
