import {DirectoryData} from "./directory";
import GitHubAuthorization from "./github-authorization";
import GitRepository from "./git-repository";
import TaskMeta from "../core/task-meta";
import TaskWithData from "../core/task-with-data";

interface GitHubCreateRepositoryData extends DirectoryData {

  /** The name of the repository. */
  name: string;

  /** A short description of the repository. */
  description?: string;

  /** A URL with more information about the repository. */
  homepage?: string;

  /**
   * Either true to create a private repository or false to create a public one.
   * Creating private repositories requires a paid GitHub account.
   */
  private?: boolean;

  /** Either true to enable issues for this repository or false to disable them. */
  /** @default true */
  has_issues?: boolean;

  /**
   * Either true to enable projects for this repository or false to disable them.
   * Note: If you're creating a repository in an organization that has disabled repository
   * projects, the default is false, and if you pass true, the API returns an error.
   */
  /** @default true */
  has_projects?: boolean;

  /** Either true to enable the wiki for this repository or false to disable it. */
  /** @default true */
  has_wiki?: boolean;

  /**
   * The id of the team that will be granted access to this repository.
   * This is only valid when creating a repository in an organization.
   */
  /** @TJS-type integer */
  team_id?: number;

  /** Pass true to create an initial commit with empty README. */
  auto_init?: boolean;

  /**
   * Desired language or platform .gitignore template to apply.
   * Use the name of the template without the extension. For example, "Haskell".
   */
  gitignore_template?: string;

  /**
   * Choose an open source license template that best suits your needs, and then use
   * the license keyword as the license_template string. For example, "mit" or "mpl-2.0".
   */
  license_template?: string;

  /** Either true to allow squash-merging pull requests, or false to prevent squash-merging. */
  /** @default true */
  allow_squash_merge?: boolean;

  /**
   * Either true to allow merging pull requests with a merge commit,
   * or false to prevent merging pull requests with merge commits.
   */
  /** @default true */
  allow_merge_commit?: boolean;

  /** Either true to allow rebase-merging pull requests, or false to prevent rebase-merging. */
  /** @default true */
  allow_rebase_merge?: boolean;
}

export default class GitHubCreateRepository extends TaskWithData<GitHubCreateRepositoryData> {
  public static meta = new TaskMeta({
    construct: GitHubCreateRepository,
    inputs: [GitHubAuthorization],
    outputs: [GitRepository],
    tsFile: __filename
  })
  protected async onInitialize (auth: GitHubAuthorization) {
    const response = await auth.octokit.repos.createForAuthenticatedUser(this.data);
    const url = response.data.clone_url;
    const repo = new GitRepository(this, {
      directory: this.data.directory,
      password_or_token: auth.data.password_or_token,
      url,
      username: response.data.owner.login
    });
    repo.git.init(repo.args);
    repo.git.addRemote({
      ...repo.args,
      remote: url
    });
  }
}
