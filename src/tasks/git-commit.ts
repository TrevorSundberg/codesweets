import GitRepository from "./git-repository";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

interface GitCommitData {
  message: string;
}

export default class GitCommit extends TaskWithData<GitCommitData> {
  public static meta = new TaskMeta({
    construct: GitCommit,
    inputs: [GitRepository]
  })
  protected async onInitialize (repo: GitRepository) {
    await repo.git.commit({
      ...repo.args,
      ...this.data,
      author: {
        email: `${repo.data.username}@example.com`,
        name: repo.data.username
      }
    });
  }
}
