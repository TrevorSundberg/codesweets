import GitRepository from "./git-repository";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

interface GitAddData {

  /** @default: '.' */
  filepath: string;
}

export default class GitAdd extends TaskWithData<GitAddData> {
  public static meta = new TaskMeta({
    construct: GitAdd,
    inputs: [GitRepository]
  })
  protected async onInitialize (repo: GitRepository) {
    await repo.git.add({...repo.args, ...this.data});
  }
}
