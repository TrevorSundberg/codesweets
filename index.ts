import GitHubAuthorization from './src/tasks/github-authorization'
import GitHubCreateRepository from './src/tasks/github-create-repository'
import TaskRoot from './src/core/task-root';
import './src/test/e2e'

const root = new TaskRoot();

new GitHubAuthorization(root, { username: 'TrevorSundberg', password: '123' })

new GitHubCreateRepository(root, { name: 'testrepo123' })

root.initialize()

console.log(JSON.stringify(GitHubCreateRepository.meta.schema));
