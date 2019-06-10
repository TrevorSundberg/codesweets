import GitAdd, {GitAddData} from "./git-add";
import GitCommit, {GitCommitData} from "./git-commit";
import GitPush from "./git-push";
import GitRepository from "./git-repository";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

export interface GitAddCommitPushData extends GitAddData, GitCommitData {}

export default class GitAddCommitPush extends TaskWithData<GitAddCommitPushData> {
  public static meta = new TaskMeta({
    construct: GitAdd,
    inputs: [GitRepository],
    outputs: [
      GitAdd,
      GitCommit,
      GitPush
    ]
  })

  protected async onInitialize () {
    new GitAdd(this, this.data);
    new GitCommit(this, this.data);
    new GitPush(this, this.data);
  }
}
