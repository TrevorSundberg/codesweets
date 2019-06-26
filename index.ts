import {GitAddCommitPush, GitClone} from "./src/git/git";
import {GitHubAuthorization, GitHubCreateRepository} from "./src/github/github";
import {FileCreate} from "./src/file/file";
import {TaskRoot} from "./src/sweet/sweet";
import Test from "./src/test/test";

(async () => {
  await Test;

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

  console.log(JSON.stringify(root.serialize(), null, 2));

  await root.run();

  console.log(JSON.stringify(GitHubCreateRepository.meta.schema));
})();
