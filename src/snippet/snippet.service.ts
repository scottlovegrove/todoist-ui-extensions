import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { Dictionary, groupBy } from 'lodash'

import { getLastWeeksDates } from '../utils/date-utils'
import { getUrl } from '../utils/url-utils'

import type { ProjectDataWithCompleted, Section, Task } from '../todoist/todoist.types'

export type SnippetOptions = {
    groupBySection?: boolean
    weeksAgo: number
}
declare global {
    interface Array<T> {
        filterNewTasks(weeksAgo: number): Array<T>
        filterTasksByLabel(label: string): Array<T>
    }
}

Array.prototype.filterNewTasks = function (this: Task[], weeksAgo: number): Task[] {
    const { end: until } = getLastWeeksDates(weeksAgo)
    const untilDay = dayjs(until)
    return this.filter((task) => !dayjs(task.added_at).isAfter(untilDay))
}

Array.prototype.filterTasksByLabel = function (this: Task[], label: string): Task[] {
    return this.filter((task) => task.labels.some((taskLabel) => taskLabel !== label))
}

@Injectable()
export class SnippetService {
    createSnippet(
        projectData: ProjectDataWithCompleted,
        options: SnippetOptions = { weeksAgo: 1 },
    ): string {
        const filteredTasks = this.applyFilters(projectData.items, options.weeksAgo)
        const tasksBySection = options.groupBySection
            ? groupBy(filteredTasks, (x) => this.getSectionName(x, projectData.sections))
            : groupBy(filteredTasks, '')

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

    private applyFilters(tasks: Task[], weeksAgo: number): Task[] {
        return tasks.filterNewTasks(weeksAgo).filterTasksByLabel('not-ready')
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
