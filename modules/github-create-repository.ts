import TaskMeta from './task-meta'
import TaskWithData from './task-with-data'
import GitHubAuthorization from './github-authorization'
import GitRepository from './git-repository'
import { ReposCreateForAuthenticatedUserParams } from '@octokit/rest';

type GitHubCreateRepositoryData = ReposCreateForAuthenticatedUserParams;

//class GitHubCreateRepositoryData {
//  /** The name of the repository. */
//  name: string
//  /** A short description of the repository. */
//  description?: string
//  /** A URL with more information about the repository. */
//  homepage?: string
//  /** Either true to create a private repository or false to create a public one. Creating private repositories requires a paid GitHub account. */
//  private?: boolean = false
//  /** Either true to enable issues for this repository or false to disable them. */
//  has_issues?: boolean = true
//  /** Either true to enable projects for this repository or false to disable them. Note: If you're creating a repository in an organization that has disabled repository projects, the default is false, and if you pass true, the API returns an error. */
//  has_projects?: boolean = true
//  /** Either true to enable the wiki for this repository or false to disable it. */
//  has_wiki?: boolean = true
//  /** The id of the team that will be granted access to this repository. This is only valid when creating a repository in an organization. */
//  /** @TJS-type integer */
//  team_id?: number
//  /** Pass true to create an initial commit with empty README. */
//  auto_init?: boolean = false
//  /** Desired language or platform .gitignore template to apply. Use the name of the template without the extension. For example, "Haskell". */
//  gitignore_template?: string
//  /** Choose an open source license template that best suits your needs, and then use the license keyword as the license_template string. For example, "mit" or "mpl-2.0". */
//  license_template?: string;
//  /** Either true to allow squash-merging pull requests, or false to prevent squash-merging. */
//  allow_squash_merge?: boolean = true
//  /** Either true to allow merging pull requests with a merge commit, or false to prevent merging pull requests with merge commits. */
//  allow_merge_commit?: boolean = true
//  /** Either true to allow rebase-merging pull requests, or false to prevent rebase-merging. */
//  allow_rebase_merge?: boolean = true
//}

export default class GitHubCreateRepository extends TaskWithData<GitHubCreateRepositoryData> {
    public static meta = new TaskMeta({
        construct: GitHubCreateRepository,
        tsFile: __filename,
        inputs: [GitHubAuthorization],
        outputs: [GitRepository],
    })

    public async initialize(auth: GitHubAuthorization) {
        await auth.octokit.repos.createForAuthenticatedUser(this.data)
        //const response = await auth.createFetch('/user/repos', this.data)
        //const json = await response.json()
        //
        //new GitRepository(this, {
        //  username: auth.data.username,
        //  password_or_token: auth.data.password,
        //  clone_url: json.clone_url
        //})

        await super.initialize()
    }
}
