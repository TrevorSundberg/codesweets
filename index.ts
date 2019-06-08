import "./src/test/e2e";
import GitHubAuthorization from "./src/tasks/github-authorization";
import GitHubCreateRepository from "./src/tasks/github-create-repository";
import TaskRoot from "./src/core/task-root";

const root = new TaskRoot();

new GitHubAuthorization(root, {password: "test", username: "TrevorSundberg"});

new GitHubCreateRepository(root, {name: "testrepo123"});

root.initialize();

console.log(JSON.stringify(GitHubCreateRepository.meta.schema));
