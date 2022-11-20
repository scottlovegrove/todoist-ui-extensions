import { Injectable } from '@nestjs/common'
import { Dictionary, groupBy } from 'lodash'

import { getUrl } from '../utils/url-utils'

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

        return `${this.snippets(completedTasksBySection, 'Completed')}${this.snippets(
            tasksBySection,
            'In progress',
        )}`
    }

    private snippets(completedTasksBySection: Dictionary<Task[]>, heading: string): string {
        if (Object.keys(completedTasksBySection).length === 0) {
            return ''
        }

        const completedSnippets = Object.keys(completedTasksBySection)
            .map((x) => this.snippetBySection(completedTasksBySection[x] ?? [], x))
            .join('\r\n')

        return `### ${heading}\r\n${completedSnippets}\r\n\r\n`
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
        const descriptionFromUrl = getUrl(task.description)
        const ref = descriptionFromUrl ? ` ([ref](${descriptionFromUrl}))` : ''
        return `${prepend}${task.content}${ref}`
    }

    private getSectionName(task: Task, sections: Section[]): string {
        const section = sections.find((x) => x.id === task.section_id)
        return section?.name ?? ''
    }
}
