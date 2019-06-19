import {GitAdd, GitAddData} from "./git-add";
import {GitCommit, GitCommitData} from "./git-commit";
import {TaskMeta, TaskWithData} from "../sweet/sweet";
import {GitPush} from "./git-push";
import {GitRepository} from "./git-repository";

export interface GitAddCommitPushData extends GitAddData, GitCommitData {}

export class GitAddCommitPush extends TaskWithData<GitAddCommitPushData> {
  public static meta = new TaskMeta({
    construct: GitAddCommitPush,
    inputs: [GitRepository],
    outputs: [
      GitAdd,
      GitCommit,
      GitPush
    ],
    schema: require("ts-schema!./git-add-commit-push.ts?GitAddCommitPushData")
  })

  protected async onInitialize () {
    new GitAdd(this, this.data);
    new GitCommit(this, this.data);
    new GitPush(this, this.data);
  }
}
