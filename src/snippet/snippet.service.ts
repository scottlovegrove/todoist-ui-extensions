import { Injectable } from '@nestjs/common'
import { groupBy } from 'lodash'

import { isUrl } from '../utils/url-utils'

import type { ProjectDataWithCompleted, Section, Task } from '../todoist/todoist.types'

export type SnippetOptions = {
    groupBySection?: boolean
}

@Injectable()
export class SnippetService {
    createSnippet(projectData: ProjectDataWithCompleted, options: SnippetOptions = {}): string {
        const tasksBySection = options.groupBySection
            ? groupBy(projectData.items, (x) => this.getSectionName(x, projectData.sections))
            : groupBy(projectData.items, '')

        const completedTasksBySection = options.groupBySection
            ? groupBy(projectData.completedTasks, (x) =>
                  this.getSectionName(x, projectData.sections),
              )
            : groupBy(projectData.completedTasks, '')

        const completedSnippets = Object.keys(completedTasksBySection)
            .map((x) => this.snippetBySection(completedTasksBySection[x] ?? [], x))
            .join('\r\n')

        const uncompletedSnippets = Object.keys(tasksBySection)
            .map((section) => this.snippetBySection(tasksBySection[section] ?? [], section))
            .join('\r\n')

        return `### Completed\r\n${completedSnippets}\r\n\r\n### Uncompleted\r\n${uncompletedSnippets}`
    }

    private snippetBySection(task: Task[], sectionName: string): string {
        const section = sectionName ? `- ${sectionName}\r\n` : ''
        const taskSnippets = task
            .map((x) => this.snippetByTask(x, Boolean(sectionName)))
            .join('\r\n')
        return `${section}${taskSnippets}`
    }

    private snippetByTask(task: Task, requiresIndent: boolean): string {
        const prepend = requiresIndent ? '    - ' : '- '
        const ref = isUrl(task.description) ? ` ([ref](${task.description}))` : ''
        return `${prepend}${task.content}${ref}`
    }

    private getSectionName(task: Task, sections: Section[]): string {
        const section = sections.find((x) => x.id === task.section_id)
        return section?.name ?? ''
    }
}
