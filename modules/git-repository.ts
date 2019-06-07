import TaskMeta from './task-meta'
import FileSystem from './file-system'

class GitRepositoryData {
    public clone_url: string
    public username?: string
    public password_or_token?: string
}

export default class GitRepository extends FileSystem<GitRepositoryData> {
    public static meta = new TaskMeta({
        construct: GitRepository,
        tsFile: __filename,
        outputs: [FileSystem]
    })

    public commit(): void {
        throw new Error("Method not implemented.");
    }
}
