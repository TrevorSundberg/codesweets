import TaskMeta from './task-meta'
import TaskWithData from './task-with-data'
import FileSystem from './file-system'

interface FileOperation {
    operation: 'prepend' | 'append' | 'replace';
    content?: string;
    /** @default utf8 */
    encoding?: BufferEncoding;
    find_regex?: string;
}

class FileData {
    public path: string
    public operations?: FileOperation[]
}

export default class File extends TaskWithData<FileData> {
    public static meta = new TaskMeta({
        construct: File,
        inputs: [FileSystem],
        tsFile: __filename,
    })
}
