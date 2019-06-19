import {Task, TaskMeta} from "../sweet/sweet";
import {GitRepository} from "./git-repository";

export class GitClone extends Task {
  public static meta: TaskMeta = new TaskMeta({
    construct: GitClone,
    inputs: [GitRepository],
    typename: "GitClone"
  })

  protected async onInitialize (repo: GitRepository) {
    await repo.git.clone(repo.args);
  }
}
