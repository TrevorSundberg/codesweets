import GitRepository from "./git-repository";
import Task from "../core/task";
import TaskMeta from "../core/task-meta";

export default class GitPush extends Task {
  public static meta = new TaskMeta({
    construct: GitPush,
    inputs: [GitRepository]
  })
  protected async onInitialize (repo: GitRepository) {
    await repo.git.push(repo.args);
  }
}
