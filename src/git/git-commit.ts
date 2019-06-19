import {TaskMeta, TaskWithData} from "../sweet/sweet";
import {GitRepository} from "./git-repository";

export interface GitCommitData {
  message: string;
}

export class GitCommit extends TaskWithData<GitCommitData> {
  public static meta = new TaskMeta({
    construct: GitCommit,
    inputs: [GitRepository],
    schema: require("ts-schema!./git-commit.ts?GitCommitData")
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
