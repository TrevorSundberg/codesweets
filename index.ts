import "./src/test/e2e";
// /import GitHubAuthorization from "./src/tasks/github-authorization";
import GitClone from "./src/tasks/git-clone";
import GitHubCreateRepository from "./src/tasks/github-create-repository";
import GitRepository from "./src/tasks/git-repository";
import TaskRoot from "./src/core/task-root";

(async () => {
  const root = new TaskRoot();

  /*
   * -new GitHubAuthorization(root, {password: "test", username: "TrevorSundberg"});
   * -new GitHubCreateRepository(root, {name: "testrepo123"});
   */

  new GitRepository(root, {
    url: "https://github.com/TrevorSundberg/inviz"
  });

  new GitClone(root);

  await root.initialize();

  console.log(root.fs.toJSON("/"));

  console.log(JSON.stringify(GitHubCreateRepository.meta.schema));
})();
