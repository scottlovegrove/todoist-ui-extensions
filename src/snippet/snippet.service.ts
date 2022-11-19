import { Injectable } from '@nestjs/common'

import type { ProjectDataWithCompleted } from '../todoist/todoist.types'

type SnippetOptions = {
    groupBySection?: boolean
}

@Injectable()
export class SnippetService {
    createSnippet(_projectData: ProjectDataWithCompleted, _options?: SnippetOptions): string {
        return 'Hello World!'
    }
}
