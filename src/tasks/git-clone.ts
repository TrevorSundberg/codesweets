import GitRepository from "./git-repository";
import Task from "../core/task";
import TaskMeta from "../core/task-meta";

export default class GitClone extends Task {
  public static meta = new TaskMeta({
    construct: GitClone,
    inputs: [GitRepository]
  })

  protected async onInitialize (repo: GitRepository) {
    await repo.git.clone(repo.args);
  }
}
