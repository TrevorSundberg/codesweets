import TaskWithData from '../core/task-with-data'
import TaskMeta from '../core/task-meta';
import Octokit from '@octokit/rest';
import { JSONSchema6 } from 'json-schema';

type GitHubAuthorizationData =
  { username: string; password: string } |
  { token: string } |
  { clientId: string; clientSecret: string }

export default class GitHubAuthorization extends TaskWithData<GitHubAuthorizationData> {
  public static meta = new TaskMeta({
    construct: GitHubAuthorization,
    tsFile: __filename,
    schemaTransform: schema => {
      (schema.anyOf[0] as JSONSchema6).title = 'Login';
      (schema.anyOf[1] as JSONSchema6).title = 'Token';
      (schema.anyOf[2] as JSONSchema6).title = 'Client Secret'
    }
  })

  public octokit: Octokit

  public async initialize() {
    const data = this.data as any;
    data.on2fa = async() => { throw new Error('Two factor authentication is not yet supported') }

    this.octokit = new Octokit({
      auth: data.token || data
    });
  }
}
