import {Task, TaskMeta} from "../sweet/sweet";
import {GitRepository} from "./git-repository";

export class GitPush extends Task {
  public static meta = new TaskMeta({
    construct: GitPush,
    inputs: [GitRepository]
  })

  protected async onInitialize (repo: GitRepository) {
    await repo.git.push(repo.args);
  }
}
