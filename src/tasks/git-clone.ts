import {Task, TaskMeta} from "../core/sweet";
import GitRepository from "./git-repository";

export default class GitClone extends Task {
  public static meta = new TaskMeta({
    construct: GitClone,
    inputs: [GitRepository]
  })

  protected async onInitialize (repo: GitRepository) {
    await repo.git.clone(repo.args);
  }
}
