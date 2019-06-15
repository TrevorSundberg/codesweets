import {Task, TaskMeta} from "../core/sweet";
import GitRepository from "./git-repository";

export default class GitPush extends Task {
  public static meta = new TaskMeta({
    construct: GitPush,
    inputs: [GitRepository]
  })

  protected async onInitialize (repo: GitRepository) {
    await repo.git.push(repo.args);
  }
}
