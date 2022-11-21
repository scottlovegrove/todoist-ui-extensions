import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

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
        const archivedTasks = await this.syncApiService.getArchivedItems(projectId)
        return {
            ...projectData,
            items: this.filterNewerTasks(projectData.items, until),
            completedTasks: this.getTaskDetails(completedTasks, archivedTasks),
        }
    }

    private filterNewerTasks(tasks: Task[], until: Date): Task[] {
        const untilDay = dayjs(until)
        return tasks.filter((task) => !dayjs(task.added_at).isAfter(untilDay))
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
