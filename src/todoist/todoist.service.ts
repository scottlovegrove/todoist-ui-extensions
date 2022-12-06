import { Injectable } from '@nestjs/common'

import { getLastWeeksDates } from '../utils/date-utils'

import { SyncApiService } from './sync-api.service'

import type { Project, ProjectDataWithCompleted, Task } from './todoist.types'

@Injectable()
export class TodoistService {
    constructor(private readonly syncApiService: SyncApiService) {}

    async getProjectData(
        projectId: Project['id'],
        weeksAgo: number,
    ): Promise<ProjectDataWithCompleted> {
        const { start: since, end: until } = getLastWeeksDates(weeksAgo)
        const projectData = await this.syncApiService.getProject(projectId)

        const completedTasks = await this.syncApiService.getCompletedForProject({
            projectId,
            since,
            until,
        })
        const promises = [
            this.syncApiService.getArchivedItems({ projectId }),
            ...projectData.sections.map((section) =>
                this.syncApiService.getArchivedItems({ sectionId: section.id }),
            ),
        ]

        const responses = await Promise.all(promises)
        const archivedTasks = responses.flat()
        return {
            ...projectData,
            completedTasks: this.getTaskDetails(completedTasks, archivedTasks),
        }
    }

    async markProjectAsCompleted(
        projectId: Project['id'],
        includeSections: boolean,
    ): Promise<void> {
        const projectData = await this.syncApiService.getProject(projectId)
        const tasks = includeSections
            ? projectData.items
            : projectData.items.filter((task) => !task.section_id)
        await this.syncApiService.markTasksAsCompleted(tasks)
    }

    private getTaskDetails(completedTasks: Task[], archivedTasks: Task[]): Task[] {
        return completedTasks.map((task) => {
            const archivedTask = archivedTasks.find(
                (archivedTask) => archivedTask.id === task.task_id,
            )
            return archivedTask ? { ...task, ...archivedTask } : task
        })
    }
}
